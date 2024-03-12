"use client";
import { useState } from "react";
import styles from "./page.module.css";
import { RedirectToSignIn, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { OwnerType, TagType } from "@/src/models/types";

interface OwnerAddDetailsViewProps {
    owner: OwnerType;
    tag: TagType;
}

export default function OwnerAddDetailsView({
    owner,
    tag,
}: OwnerAddDetailsViewProps) {
    const [firstname, setFirstname] = useState<string>("");
    const [lastname, setLastname] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [phoneNumber2, setPhoneNumber2] = useState<string>("");
    const [addressline1, setAddressline1] = useState<string>("");
    const [addressline2, setAddressline2] = useState<string>("");
    const [zipcode, setZipcode] = useState<string>("");

    const user = useUser();
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
            ownerID: owner.id,
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
            router.push(`/setup/${tag.TAG_TOKEN}`);
        } else {
            console.log("Owner details not added");
        }
    };

    return (
        <>
            <div className="">
                <h1 className="text-headingCustom text-black-400 top-0  mb-[25px] text-center underline">
                    Account Details
                </h1>

                <input
                    type="text"
                    className="border-1 border-black-400 text-[rgba(0,0,0,0.75)]-400 mb-[25px] w-[calc(100vw-72px)]  bg-cream text-base shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)]"
                    placeholder="Firstname"
                    onChange={(e) => setFirstname(e.target.value)}
                    required={true}
                />
                <input
                    type="text"
                    className="border-1 border-black-400 text-[rgba(0,0,0,0.75)]-400 mb-[25px] w-[calc(100vw-72px)]  bg-cream text-base shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)]"
                    placeholder="Lastname"
                    onChange={(e) => setLastname(e.target.value)}
                    required={true}
                />
                <input
                    type="text"
                    className="border-1 border-black-400 text-[rgba(0,0,0,0.75)]-400 mb-[25px] w-[calc(100vw-72px)]  bg-cream text-base shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)]"
                    placeholder="Phone number"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required={true}
                />
                <input
                    type="text"
                    className="border-1 border-black-400 text-[rgba(0,0,0,0.75)]-400 mb-[25px] w-[calc(100vw-72px)]  bg-cream text-base shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)]"
                    placeholder="Phone number 2 (optional)"
                    onChange={(e) => setPhoneNumber2(e.target.value)}
                    required={false}
                />
                <input
                    type="text"
                    className="border-1 border-black-400 text-[rgba(0,0,0,0.75)]-400 mb-[25px] w-[calc(100vw-72px)]  bg-cream text-base shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)]"
                    placeholder="Address line 1"
                    onChange={(e) => setAddressline1(e.target.value)}
                    required={true}
                />
                <input
                    type="text"
                    className="border-1 border-black-400 text-[rgba(0,0,0,0.75)]-400 mb-[25px] w-[calc(100vw-72px)]  bg-cream text-base shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)]"
                    placeholder="Address line 2 (optional)"
                    onChange={(e) => setAddressline2(e.target.value)}
                    required={false}
                />
                <input
                    type="text"
                    className="border-1 border-black-400 text-[rgba(0,0,0,0.75)]-400 mb-[25px] w-[calc(100vw-72px)]  bg-cream text-base shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)]"
                    placeholder="Zipcode"
                    onChange={(e) => setZipcode(e.target.value)}
                    required={true}
                />

                <button
                    className="bottom-[36px] h-[48px] w-[calc(100%-72px)] bg-dark-purple text-cream"
                    onClick={(e) => verifyForm(e)}
                >
                    CONTINUE
                </button>
            </div>
        </>
    );
}
