"use client";
import { useState } from "react";
import styles from "./page.module.css";
import { RedirectToSignIn, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { FileUploader } from "react-drag-drop-files";
import { useRouter } from "next/navigation";

interface TagAddDetailsViewProps {
    tag: any;
}

export default function TagAddDetailsView({ tag }: TagAddDetailsViewProps) {
    const [petName, setPetName] = useState<string>("");
    const [petPhotoFile, setPetPhotoFile] = useState<File | null>(null);
    const [extraInformation, setExtraInformation] = useState<string>("");
    const [useOwnerDetails, setUseOwnerDetails] = useState<boolean>(false);

    const [ownersName, setOwnersName] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [addressline1, setAddressline1] = useState<string>("");
    const [addressline2, setAddressline2] = useState<string>("");
    const [zipcode, setZipcode] = useState<string>("");

    const [errors, setErrors] = useState<string[]>([]);

    const user = useUser();
    const router = useRouter();

    const verifyForm = (e: any) => {
        e.preventDefault();

        if (petName == "") {
            setErrors(["Pet name is empty"]);
            return;
        }

        // if (petPhotoFile == null) {
        //     setErrors(["Pet photo is empty"]);
        //     return;
        // }

        if (!useOwnerDetails) {
            if (ownersName == "") {
                setErrors(["Owners name is empty"]);
                return;
            }

            if (phoneNumber == "") {
                setErrors(["Phone number is empty"]);
                return;
            }

            if (addressline1 == "") {
                setErrors(["Addressline 1 is empty"]);
                return;
            }

            if (zipcode == "") {
                setErrors(["Zipcode is empty"]);
                return;
            }
        }

        console.log(errors);

        submitForm();
    };

    const submitForm = async () => {
        const tagDetails = {
            pet_name: petName,
            pet_photo: petPhotoFile,
            extra_information: extraInformation,
            use_owner_details: useOwnerDetails,
            owners_name: ownersName,
            phone_number: phoneNumber,
            addressline1: addressline1,
            addressline2: addressline2,
            zipcode: zipcode,
            tagID: tag.id,
        };

        console.log(tagDetails);

        const response = await fetch("/api/tags/addDetails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(tagDetails),
        });

        if (response.status == 200) {
            console.log("Tag details added successfully");
            console.log(response);
            router.push("/?token=" + tag.TAG_TOKEN);
        } else {
            setErrors(["Something went wrong"]);
        }
    };

    if (!user) {
        return <RedirectToSignIn />;
    }

    return (
        <>
            <div className="flex flex-col">
                <h1 className="top-0 text-headingCustom underline text-black text-center mb-[25px]">
                    Add Tag Details
                </h1>

                <input
                    type="text"
                    className="border-1 border-black-400 bg-cream shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)] w-[calc(100vw-72px)]  text-base text-[rgba(0,0,0,0.75)]-400 mb-[25px]"
                    placeholder="Pet name"
                    onChange={(e) => setPetName(e.target.value)}
                    required={true}
                />
                <div className="text-left mb-[25px]">
                    <span>Upload a photo of your pet</span>
                    <FileUploader
                        className="border-1 border-black-400 bg-cream shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)] w-[calc(100vw-72px)]  text-base text-[rgba(0,0,0,0.75)]-400 mb-[25px]"
                        onDrop={(files: any) => {
                            console.log(files);
                        }}
                    />
                </div>

                <textarea
                    className="border-1 border-black-400 bg-cream shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)] w-[calc(100vw-72px)]  text-base text-[rgba(0,0,0,0.75)]-400 mb-[25px]"
                    placeholder="Extra information"
                    onChange={(e) => setExtraInformation(e.target.value)}
                />

                <div className="text-left mb-[25px]">
                    <input
                        type="checkbox"
                        className="rounded-[50%]"
                        name="use_owner_information"
                        defaultChecked={useOwnerDetails}
                        onChange={(e) => setUseOwnerDetails(e.target.checked)}
                        required={true}
                    />
                    <span> Use owner information</span>
                </div>

                <input
                    type="text"
                    className="border-1 border-black-400 bg-cream shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)] w-[calc(100vw-72px)]  text-base text-[rgba(0,0,0,0.75)]-400 mb-[25px]"
                    placeholder="Owners name"
                    onChange={(e) => setOwnersName(e.target.value)}
                    disabled={useOwnerDetails}
                    required={!useOwnerDetails}
                />
                <input
                    type="text"
                    className="border-1 border-black-400 bg-cream shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)] w-[calc(100vw-72px)]  text-base text-[rgba(0,0,0,0.75)]-400 mb-[25px]"
                    placeholder="Phone number"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={useOwnerDetails}
                    required={!useOwnerDetails}
                />
                <input
                    type="text"
                    className="border-1 border-black-400 bg-cream shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)] w-[calc(100vw-72px)]  text-base text-[rgba(0,0,0,0.75)]-400 mb-[25px]"
                    placeholder="Phone number 2 (optiional)"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={useOwnerDetails}
                    required={false}
                />
                <input
                    type="text"
                    className="border-1 border-black-400 bg-cream shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)] w-[calc(100vw-72px)]  text-base text-[rgba(0,0,0,0.75)]-400 mb-[25px]"
                    placeholder="Address line 1"
                    onChange={(e) => setAddressline1(e.target.value)}
                    disabled={useOwnerDetails}
                    required={!useOwnerDetails}
                />
                <input
                    type="text"
                    className="border-1 border-black-400 bg-cream shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)] w-[calc(100vw-72px)]  text-base text-[rgba(0,0,0,0.75)]-400 mb-[25px]"
                    placeholder="Address line 2"
                    onChange={(e) => setAddressline2(e.target.value)}
                    disabled={useOwnerDetails}
                    required={false}
                />
                <input
                    type="text"
                    className="border-1 border-black-400 bg-cream shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)] w-[calc(100vw-72px)]  text-base text-[rgba(0,0,0,0.75)]-400 mb-[25px]"
                    placeholder="Zip / Postcode"
                    onChange={(e) => setZipcode(e.target.value)}
                    disabled={useOwnerDetails}
                    required={!useOwnerDetails}
                />

                {errors.map((error) => (
                    <div className="text-red-500" key={error}>
                        {error}
                    </div>
                ))}

                <button
                    className="bottom-[36px] w-[100%] bg-dark-purple text-cream h-[48px]"
                    onClick={(e) => verifyForm(e)}
                >
                    ADD TAG
                </button>
            </div>
        </>
    );
}
