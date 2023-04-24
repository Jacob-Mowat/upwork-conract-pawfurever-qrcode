"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { RedirectToSignIn, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { FileUploader } from "react-drag-drop-files";
import { useRouter } from "next/navigation";
import { OwnerDetailsType, OwnerType, TagType } from "@/src/app/models/types";
import { LoadingSpinner } from "../LoadingSpinner.component";
// import heic2any from "heic2any";
import { s3Client } from "@/lib/s3bucket";

const getOwnerDetails = async (oID: string) => {
    const request = await fetch(`/api/owner-details/?ownerID=${oID}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const response = await request.json();

    return response;
};

interface TagAddDetailsViewProps {
    tag: TagType;
}

export default function TagAddDetailsView({ tag }: TagAddDetailsViewProps) {
    const [loadingData, setLoadingData] = useState(true);
    const [ownerDetails, setOwnerDetails] = useState<OwnerDetailsType>();

    const [petPhotoFile, setPetPhotoFile] = useState<File>();

    const [petName, setPetName] = useState<string>("");
    const [petPhotoUrl, setPetPhotoUrl] = useState<string>("");
    const [extraInformation, setExtraInformation] = useState<string>("");
    const [useOwnerDetails, setUseOwnerDetails] = useState<boolean>(false);

    const [ownersName, setOwnersName] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [phoneNumber2, setPhoneNumber2] = useState<string>("");
    const [addressline1, setAddressline1] = useState<string>("");
    const [addressline2, setAddressline2] = useState<string>("");
    const [zipcode, setZipcode] = useState<string>("");

    const [errors, setErrors] = useState<string[]>([]);

    const user = useUser();
    const router = useRouter();

    const fileTypes = ["JPG", "PNG", "GIF"];

    useEffect(() => {
        if (loadingData) {
            if (!tag.owner_id) {
                return;
            }

            console.log(tag.owner_id as string);

            getOwnerDetails(tag.owner_id as string).then((data) => {
                setLoadingData(false);
                setOwnerDetails(data.body.ownerDetails);
                console.log(data.body.ownerDetails);
            });
        }

        // return () => {
        //     setLoadingData(true);
        // };
    }, [loadingData, tag]);

    const uploadPhoto = async (file: File) => {
        console.log(file);

        // const formData = new FormData();

        // // Check if file is HEIC format
        // if (file.type === "image/heic") {
        //     // Convert HEIC to JPEG
        //     const jpegFile = await heic2any({
        //         blob: file,
        //         toType: "image/jpeg",
        //     });
        //     if (Array.isArray(jpegFile)) {
        //         // If jpegFile is an array, append each Blob object to formData
        //         jpegFile.forEach((blob, index) => {
        //             formData.append(
        //                 `image${index}`,
        //                 blob,
        //                 `image${index}.jpeg`
        //             );
        //         });
        //     } else {
        //         // If jpegFile is a single Blob object, append it to formData
        //         formData.append("image", jpegFile, "image.jpeg");
        //     }
        // } else {
        //     // Add file to formData as is
        //     formData.append("image", file);
        // }

        // Upload to S3
        const uploadParams = {
            Bucket: "ar-t-cacher-app-s3",
            Key: `PawFurEver/tag/${tag.TAG_TOKEN}/${file.name}{f}`,
            ACL: "public-read",
            Body: file as File,
        };

        // Send the upload to S3
        const response = await s3Client.upload(uploadParams).promise();

        setPetPhotoUrl(response.Location);
        console.log(response.Location);

        return;
    };

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
            pets_photo: petPhotoUrl,
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
            router.push(`/view/${tag.TAG_TOKEN}`);
        } else {
            setErrors(["Something went wrong"]);
        }
    };

    const handleUseOwnerDetails = (e: any) => {
        setUseOwnerDetails(e.target.checked);

        if (e.target.checked && ownerDetails != null) {
            setOwnersName(
                `${ownerDetails.owner_firstname as string} ${
                    ownerDetails.owner_lastname as string
                }`
            );

            setPhoneNumber(ownerDetails.owner_phone_number as string);

            setPhoneNumber2(ownerDetails.owner_phone_number2 as string);

            setAddressline1(ownerDetails.owner_address_line1 as string);

            setAddressline2(ownerDetails.owner_address_line2 as string);

            setZipcode(ownerDetails.owner_address_zip as string);
        }
    };

    if (!user) {
        return <RedirectToSignIn />;
    }

    if (loadingData || ownerDetails == null) {
        return <LoadingSpinner />;
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
                        name="file"
                        handleChange={(file: any) => uploadPhoto(file)}
                        types={fileTypes}
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
                        onChange={(e) => handleUseOwnerDetails(e)}
                        required={true}
                    />
                    <span> Use owner information</span>
                </div>

                <input
                    type="text"
                    className="border-1 border-black-400 bg-cream shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)] w-[calc(100vw-72px)]  text-base text-[rgba(0,0,0,0.75)]-400 mb-[25px]"
                    placeholder={
                        useOwnerDetails
                            ? `${ownerDetails.owner_firstname} ${ownerDetails.owner_lastname}`
                            : "Owners name"
                    }
                    onChange={(e) => setOwnersName(e.target.value)}
                    disabled={useOwnerDetails}
                    required={!useOwnerDetails}
                />
                <input
                    type="text"
                    className="border-1 border-black-400 bg-cream shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)] w-[calc(100vw-72px)]  text-base text-[rgba(0,0,0,0.75)]-400 mb-[25px]"
                    placeholder={
                        useOwnerDetails
                            ? (ownerDetails.owner_phone_number as string)
                            : "Phone number"
                    }
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={useOwnerDetails}
                    required={!useOwnerDetails}
                />
                <input
                    type="text"
                    className="border-1 border-black-400 bg-cream shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)] w-[calc(100vw-72px)]  text-base text-[rgba(0,0,0,0.75)]-400 mb-[25px]"
                    placeholder={
                        useOwnerDetails
                            ? (ownerDetails.owner_phone_number2 as string)
                            : "Phone number 2 (optional)"
                    }
                    onChange={(e) => setPhoneNumber2(e.target.value)}
                    disabled={useOwnerDetails}
                    required={false}
                />
                <input
                    type="text"
                    className="border-1 border-black-400 bg-cream shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)] w-[calc(100vw-72px)]  text-base text-[rgba(0,0,0,0.75)]-400 mb-[25px]"
                    placeholder={
                        useOwnerDetails
                            ? (ownerDetails.owner_address_line1 as string)
                            : "Address line 1"
                    }
                    onChange={(e) => setAddressline1(e.target.value)}
                    disabled={useOwnerDetails}
                    required={!useOwnerDetails}
                />
                <input
                    type="text"
                    className="border-1 border-black-400 bg-cream shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)] w-[calc(100vw-72px)]  text-base text-[rgba(0,0,0,0.75)]-400 mb-[25px]"
                    placeholder={
                        useOwnerDetails
                            ? (ownerDetails.owner_address_line2 as string)
                            : "Address line 2 (optional)"
                    }
                    onChange={(e) => setAddressline2(e.target.value)}
                    disabled={useOwnerDetails}
                    required={false}
                />
                <input
                    type="text"
                    className="border-1 border-black-400 bg-cream shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)] w-[calc(100vw-72px)]  text-base text-[rgba(0,0,0,0.75)]-400 mb-[25px]"
                    placeholder={
                        useOwnerDetails
                            ? (ownerDetails.owner_address_zip as string)
                            : "Zip / Postcode"
                    }
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
