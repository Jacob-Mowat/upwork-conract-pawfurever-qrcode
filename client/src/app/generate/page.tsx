"use client";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "./page.module.css";
import {
    SignedIn,
    SignedOut,
    RedirectToSignIn,
    useUser,
} from "@clerk/nextjs/app-beta/client";
import { useQRCode } from "next-qrcode";
import { useState, useEffect } from "react";
import { setHttpClientAndAgentOptions } from "next/dist/server/config";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { setTimeout } from "timers";
import { Navbar } from "@/src/components/NavBar.component";
import { LoadingSpinner } from "@/src/components/LoadingSpinner.component";
import Link from "next/link";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    const [numOfTokensToGenerate, setNumOfTokensToGenerate] = useState(1);
    const [generatingTags, setGeneratingTags] = useState(false);
    const [isGenerated, setIsGenerated] = useState(false);
    const [imageData, setImageData] = useState("");
    const [generatedTagToken, setGeneratedTagToken] = useState("");
    const [renderQRCode, setRenderQRCode] = useState(false);
    const [showDownloadButton, setShowDownloadButton] = useState(false);
    const [verified, setVerified] = useState(false);

    const [downloadURL, setDownloadURL] = useState("");
    const [downloadFileName, setDownloadFileName] = useState("");

    const qrCodeHeight = 325;
    const qrCodeSetupKeyHeight = 50;

    const { SVG } = useQRCode();
    const clerkAuth = useUser();
    const router = useRouter();

    useEffect(() => {
        if (clerkAuth.isSignedIn && clerkAuth.user) {
            const checkIsAdmin = async () => {
                const request = await fetch(
                    `/api/owners/isAdmin?uID=${clerkAuth.user.id}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                const response = await request.json();

                console.log(response);

                if (response.status === 200) {
                    console.log("User is admin");
                    setVerified(true);
                } else {
                    console.log("User is not admin");
                    router.push("/unauthorized");
                }
            };

            checkIsAdmin();
        }
    }, [clerkAuth.isSignedIn, clerkAuth.user, router]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        setGeneratingTags(true);

        // Get a uuid for this set of tags
        const uuid = uuidv4();

        // const request = await fetch('api/owners', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ email: clientEmail })
        // });

        // const response = await request.json();

        // console.log(await response);

        // // Get the owner ID from the response
        // const owner_id = await response.body.id;

        // Create a new tag
        const tagRequest = await fetch("api/tags", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                numOfTagsToGenerate: numOfTokensToGenerate,
            }),
        });

        const tagResponse = await tagRequest.json();

        console.log(tagResponse);

        var qrCodeSVGsToSave: any[] = [];

        if ((await tagResponse.status) === 200) {
            console.log(tagResponse.body.tags);
            for (let i = 0; i < tagResponse.body.tags.length; i++) {
                console.log("Index: ", i);
                console.log("Tag Token: ", tagResponse.body.tags[i].TAG_TOKEN);
                console.log("Setup Key: ", tagResponse.body.tags[i].setup_key);
                setGeneratedTagToken(tagResponse.body.tags[i].TAG_TOKEN);

                setRenderQRCode(true);

                // // Wait for the QR Code to render
                await new Promise((r) => setTimeout(r, 1000));

                // Get the SVG Element
                var svgElement: SVGElement = document.getElementById(
                    "qr-canvas-container"
                )?.children[0].children[0] as SVGElement;
                console.log(svgElement);
                console.log("[BEFORE] SVG Element: ", svgElement.outerHTML);

                // Increase height of QR Code
                svgElement.setAttribute(
                    "height",
                    `${qrCodeHeight + qrCodeSetupKeyHeight}`
                );
                // svgElement.setAttribute("viewBox", `0 0 35 39`);
                // svgElement.height = qrCodeHeight+qrCodeSetupKeyHeight;

                // // Generated HTML SVG Code
                var QRCodeHTML = svgElement.innerHTML;

                svgElement.innerHTML = `
                    <g transform="translate(0, -3.14)">${QRCodeHTML}</g>
                    <rect class="setup-key" x="0" y="${
                        (qrCodeHeight / (qrCodeHeight + qrCodeSetupKeyHeight)) *
                        100
                    }%" width="100%" height="${
                    (qrCodeSetupKeyHeight /
                        (qrCodeHeight + qrCodeSetupKeyHeight)) *
                    100
                }%" fill="#FFFFFF"/>
                    <text class="setup-key-font" x='50%' y='${
                        (qrCodeHeight /
                            (qrCodeHeight + qrCodeSetupKeyHeight / 2)) *
                        100
                    }%' dominant-baseline='middle' text-anchor='middle' font-weight="bolder" font-size='3px' font-family="Arial" fill="black">${(
                    (await tagResponse.body.tags[i].setup_key) as string
                ).toUpperCase()}</text>
                `;

                console.log("[AFTER] SVG Element: ", svgElement.outerHTML);

                qrCodeSVGsToSave = [
                    ...qrCodeSVGsToSave,
                    {
                        name: tagResponse.body.tags[i].TAG_TOKEN,
                        data: svgElement.outerHTML,
                    },
                ];

                // clear the svg element
                svgElement.innerHTML = QRCodeHTML;

                setRenderQRCode(false);
            }
            setIsGenerated(true);
        } else {
            alert("Error generating QR Code");
        }

        console.log("Generating qr-tags: ", qrCodeSVGsToSave);

        // Upload the SVG QR codes to the api server to save and zip
        const zipRequest = await fetch("api/zip", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ uuid: uuid, svg_list: qrCodeSVGsToSave }),
        });

        const zipResponse = await zipRequest.json();

        console.log(await zipResponse);

        if (zipResponse.status === 200) {
            console.log("Zip file generated: ", zipResponse.body.zip_file);

            // Set the download URL
            setDownloadURL(zipResponse.body.zip_file_url);
            console.log("Download URL: ", zipResponse.body.zip_file_url);

            // Set the download file name
            setDownloadFileName(zipResponse.body.zip_file_name);
            console.log("Download file name: ", zipResponse.body.zip_file_name);

            // // Set the image data to the zip file
            // setImageData(await zipResponse.body.zip_file);

            setShowDownloadButton(true);
            setGeneratingTags(false);
            setIsGenerated(true);
        } else {
            alert("Error generating QR Code");
            setGeneratingTags(false);
        }
    };

    if (generatingTags) {
        return (
            <>
                <Navbar page="generate" />
                <LoadingSpinner display_text="Generating QR Codes" />
                <div className="isolate bg-cream px-6 py-24 sm:py-32 lg:px-8 invisible">
                    <div
                        id="qr-canvas-container"
                        className="border-2 border-lightest-purple"
                    >
                        {renderQRCode && (
                            <SVG
                                text={
                                    "https://qr.mowat.dev/view/" +
                                    generatedTagToken
                                }
                                options={{
                                    level: "H",
                                    margin: 3,
                                    scale: 5,
                                    width: qrCodeHeight,
                                    color: {
                                        dark: "#000000",
                                        light: "#FFFFFF",
                                    },
                                }}
                            />
                        )}
                    </div>
                </div>
            </>
        );
    }

    if (!generatingTags && showDownloadButton) {
        return (
            <SignedIn>
                <Navbar page="generate" />
                <div className="flex w-[80%] mx-auto justify-center pt-24 sm:flex-col md:flex-col">
                    <div className="bg-cream ">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                Finished
                            </h2>
                            <p className="mt-2 text-lg leading-8 text-gray-600">
                                Your {numOfTokensToGenerate} QR Codes have been
                                generated. Click the button below to download
                                them.
                            </p>
                            <p className="mt-2 text-lg leading-8 text-gray-600">
                                This download link is also saved in{" "}
                                <Link href="/dashboard" className="text-purple">
                                    Generated QR Tags
                                </Link>
                            </p>
                        </div>
                        <div className="mx-auto max-w-2xl text-center py-4 mt-10">
                            {isGenerated && (
                                <>
                                    <a
                                        href={downloadURL}
                                        download={downloadFileName}
                                        className="block w-full px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm bg-dark-purple hover:purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f0e2fc]-600"
                                        onClick={(e) => {
                                            setShowDownloadButton(false);
                                        }}
                                    >
                                        Download QR Codes
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </SignedIn>
        );
    }

    if (!verified) {
        if (!clerkAuth.isSignedIn) {
            return <RedirectToSignIn />;
        }
        return <LoadingSpinner display_text="Verifying your account" />;
    }

    return (
        <>
            <SignedIn>
                <Navbar page="generate" />
                <div className="flex justify-center py-12 sm:flex-col md:flex-col">
                    <div className="isolate bg-cream px-6 py-24 sm:py-32 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                Generate
                            </h2>
                            <p className="mt-2 text-lg leading-8 text-gray-600">
                                Create a new QR Code for a client
                            </p>
                        </div>
                        <form
                            action="#"
                            method="POST"
                            className="mx-auto mt-16 max-w-xl sm:mt-20"
                        >
                            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="n-codes"
                                        className="block text-sm font-semibold leading-6 text-gray-900"
                                    >
                                        Number of QR Codes to generate
                                    </label>
                                    <div className="mt-2.5">
                                        <input
                                            type="number"
                                            name="n-codes"
                                            id="n-codes"
                                            defaultValue={1}
                                            className="block w-full border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            onChange={(e) =>
                                                setNumOfTokensToGenerate(
                                                    parseInt(e.target.value)
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-10">
                                <button
                                    type="submit"
                                    className="block w-full bg-dark-purple hover:purple disabled:cream px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-[#f2e5fe] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f0e2fc]-600"
                                    onClick={(e) => handleSubmit(e)}
                                >
                                    Generate QR Code
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </SignedIn>
        </>
    );
}
