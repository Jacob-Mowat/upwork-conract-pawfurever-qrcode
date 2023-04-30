"use client";
import { LoadingSpinner } from "@/src/components/LoadingSpinner.component";
import { Navbar } from "@/src/components/NavBar.component";
import { useEffect, useState } from "react";
import { AiFillFileZip, AiOutlineFileZip } from "react-icons/ai";
import { IconContext } from "react-icons/lib";
import { ZipDownloadUrlsType } from "../models/types";

export default function GeneratedTagListPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [zipDownloadUrls, setZipDownloadUrls] = useState<
        ZipDownloadUrlsType[]
    >([]);

    useEffect(() => {
        if (isLoading) {
            const getZipDownloadUrls = async () => {
                const request = await fetch(`/api/tags/zip-download-urls`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const response = await request.json();

                console.log(response);

                return await response;
            };

            getZipDownloadUrls().then((response) => {
                setZipDownloadUrls(response.body.zip_download_urls);
                setIsLoading(false);
            });
        }
    }, [isLoading]);

    if (isLoading) {
        return <LoadingSpinner display_text="Loading list..." />;
    }

    return (
        <>
            <Navbar page="generated-tags-list" />
            <div className="flex overflow-auto justify-center items-center">
                <div className="flex flex-col w-full justify-center items-center p-4">
                    <div className="text-center p-4">
                        <h1 className="text-4xl underline text-black-400 text-center">
                            Your Tags
                        </h1>
                    </div>
                    <div className="flex w-[100%] flex-col items-center justify-center">
                        {zipDownloadUrls.length == 0 ? (
                            <h1 className="text-2xl font-bold">
                                No found zip download URLs.
                            </h1>
                        ) : (
                            <>
                                <IconContext.Provider value={{ size: "2em" }}>
                                    {zipDownloadUrls.map((zip_file, i) => {
                                        return (
                                            <div
                                                className="flex flex-col md:flex-row w-full relative bg-cream border border-lightest-purple p-2 my-1 text-center rounded-md shadow-md"
                                                key={i}
                                            >
                                                <div className="flex flex-col w-full justify-center items-center">
                                                    <div className="flex flex-col w-full md:flex-row md:justify-between px-8">
                                                        <div>
                                                            <div className="text-2xl font-bold">
                                                                {
                                                                    zip_file.zip_file_name
                                                                }
                                                            </div>
                                                            <div className="text-xl font-bold md:text-left">
                                                                {
                                                                    zip_file.num_of_tags as number
                                                                }{" "}
                                                                {zip_file.num_of_tags ==
                                                                1
                                                                    ? "Tag"
                                                                    : "Tags"}{" "}
                                                                in this zip
                                                                file.
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-row justify-center items-center mt-[25px] md:mt-0">
                                                            <a
                                                                href={
                                                                    zip_file.zip_file_url as string
                                                                }
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="flex flex-row justify-center items-center"
                                                            >
                                                                <AiOutlineFileZip />

                                                                <h1 className="text-xl font-bold">
                                                                    Download
                                                                </h1>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </IconContext.Provider>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
