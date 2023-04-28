"use client";

import { LoadingSpinner } from "@/src/components/LoadingSpinner.component";
import { useEffect, useState } from "react";
import { OwnerDetailsType, TagType } from "../../../../models/types";
import { Navbar } from "@/src/components/NavBar.component";
import TagAddDetailsView from "@/src/components/tags/TagAddDetailsView.component";
import { RedirectToSignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { s3Client } from "@/lib/s3bucket";
import { FileUploader } from "react-drag-drop-files";

export default function CreateOwnerDetailsPage({
    params,
}: {
    params: { token: string; id: Number };
}) {
    const [firstname, setFirstname] = useState<string>("");
    const [lastname, setLastname] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [phoneNumber2, setPhoneNumber2] = useState<string>("");
    const [addressline1, setAddressline1] = useState<string>("");
    const [addressline2, setAddressline2] = useState<string>("");
    const [zipcode, setZipcode] = useState<string>("");

    const router = useRouter();

    const verifyForm = (e: any) => {
        e.preventDefault();
        console.log("Form submitted");

        if (phoneNumber == "") {
            console.log("Phone number is empty");
            return;
        }

        if (addressline1 == "") {
            console.log("Addressline 1 is empty");
            return;
        }

        if (zipcode == "") {
            console.log("Zipcode is empty");
            return;
        }

        console.log("Form is valid");

        submitForm();
    };

    const submitForm = async () => {
        const ownerDetails = {
            firstname: firstname,
            lastname: lastname,
            phone_number: phoneNumber,
            phone_number2: phoneNumber2,
            addressline1: addressline1,
            addressline2: addressline2,
            zipcode: zipcode,
            ownerID: params.id,
        };

        const ownerDetailsRequest = await fetch(`/api/owner-details`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(ownerDetails),
        });

        const ownerDetailsResponse = await ownerDetailsRequest.json();

        console.log(ownerDetailsResponse);

        if (ownerDetailsResponse.status == 200) {
            console.log("Owner details added");
            router.push(`/setup/${params.token}`);
        } else {
            console.log("Owner details not added");
        }
    };

    return (
        <>
            <Navbar />
            <div className="flex h-[calc(100vh-64px)] overflow-auto justify-center items-center">
                <div className="text-center">
                    <div className="flex flex-col justify-center items-center">
                        <h1 className="top-0 text-headingCustom underline  text-black-400 text-center mb-[25px]">
                            Account Details
                        </h1>

                        <input
                            type="text"
                            className="border-1 border-black-400 bg-cream shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)] w-[calc(100vw-72px)]  text-base text-[rgba(0,0,0,0.75)]-400 mb-[25px]"
                            placeholder="Firstname"
                            onChange={(e) => setFirstname(e.target.value)}
                            required={true}
                        />
                        <input
                            type="text"
                            className="border-1 border-black-400 bg-cream shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)] w-[calc(100vw-72px)]  text-base text-[rgba(0,0,0,0.75)]-400 mb-[25px]"
                            placeholder="Lastname"
                            onChange={(e) => setLastname(e.target.value)}
                            required={true}
                        />
                        <input
                            type="text"
                            className="border-1 border-black-400 bg-cream shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)] w-[calc(100vw-72px)]  text-base text-[rgba(0,0,0,0.75)]-400 mb-[25px]"
                            placeholder="Phone number"
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required={true}
                        />
                        <input
                            type="text"
                            className="border-1 border-black-400 bg-cream shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)] w-[calc(100vw-72px)]  text-base text-[rgba(0,0,0,0.75)]-400 mb-[25px]"
                            placeholder="Phone number 2 (optional)"
                            onChange={(e) => setPhoneNumber2(e.target.value)}
                            required={false}
                        />
                        <input
                            type="text"
                            className="border-1 border-black-400 bg-cream shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)] w-[calc(100vw-72px)]  text-base text-[rgba(0,0,0,0.75)]-400 mb-[25px]"
                            placeholder="Address line 1"
                            onChange={(e) => setAddressline1(e.target.value)}
                            required={true}
                        />
                        <input
                            type="text"
                            className="border-1 border-black-400 bg-cream shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)] w-[calc(100vw-72px)]  text-base text-[rgba(0,0,0,0.75)]-400 mb-[25px]"
                            placeholder="Address line 2 (optional)"
                            onChange={(e) => setAddressline2(e.target.value)}
                            required={false}
                        />
                        <input
                            type="text"
                            className="border-1 border-black-400 bg-cream shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)] w-[calc(100vw-72px)]  text-base text-[rgba(0,0,0,0.75)]-400 mb-[25px]"
                            placeholder="Zipcode"
                            onChange={(e) => setZipcode(e.target.value)}
                            required={true}
                        />

                        <button
                            className="bottom-[36px] w-[calc(100%-72px)] bg-dark-purple text-cream h-[48px]"
                            onClick={(e) => verifyForm(e)}
                        >
                            CONTINUE
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
