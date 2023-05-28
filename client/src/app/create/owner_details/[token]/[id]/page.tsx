"use client";

import { LoadingSpinner } from "@/src/components/LoadingSpinner.component";
import { useEffect, useState } from "react";
import { OwnerDetailsType, TagType } from "../../../../../models/types";
import { Navbar } from "@/src/components/NavBar.component";
import { RedirectToSignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { s3Client } from "@/lib/s3bucket";
import { FileUploader } from "react-drag-drop-files";

export default function CreateOwnerDetailsPage({
    params,
}: {
    params: { token: string; id: Number };
}) {
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [phoneNumberAdditional1, setPhoneNumberAdditional1] = useState("");
    const [phoneNumberAdditional2, setPhoneNumberAdditional2] = useState("");
    const [email, setEmail] = useState("");
    const [emailAdditional, setEmailAdditional] = useState("");
    const [streetAddress, setStreetAddress] = useState("");
    const [apartmentSuite, setApartmentSuite] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipcode, setZipcode] = useState("");

    const [errors, setErrors] = useState<string[]>([]);

    const router = useRouter();

    const verifyForm = (e: any) => {
        e.preventDefault();

        setErrors([]);
        let errorsList: string[] = [];

        if (name == "") {
            errorsList.push("Name is empty");
        }

        if (email == "") {
            errorsList.push("Email is empty");
        }

        // check email is valid format
        if (!email.includes("@")) {
            errorsList.push("Email is not valid");
        }

        if (phoneNumber == "") {
            errorsList.push("Phone number is empty");
        }

        if (errorsList.length > 0) {
            setErrors(errorsList);
            console.log("Form is invalid");
            return;
        } else {
            console.log("Form is valid");
            submitForm();
        }
    };

    const submitForm = async () => {
        const ownerDetails = {
            data: {
                name: name,
                phone_number: phoneNumber,
                phone_number_additional_1: phoneNumberAdditional1,
                phone_number_additional_2: phoneNumberAdditional2,
                email: email,
                email_additional: emailAdditional,
                street_address: streetAddress,
                apt_suite_unit: apartmentSuite,
                city: city,
                state: state,
                zipcode: zipcode,
            },
            ownerID: params.id,
        };

        console.log(ownerDetails);

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
            <div className="flex items-center justify-center overflow-auto">
                <div className="flex flex-col items-center justify-center">
                    <div className="flex-0 top-[96px] mb-[25px] mt-[25px] w-full text-center">
                        <div className="text-black-400 text-4xl">
                            Parent&apos;s Details
                        </div>
                    </div>

                    <input
                        type="text"
                        className="border-1 border-black-[rgba(0,0,0,0.5)] mb-[25px] w-[calc(100vw-72px)] rounded-[5px] bg-cream text-base placeholder:text-slate-700"
                        placeholder="Name"
                        onChange={(e) => setName(e.target.value)}
                        required={true}
                    />
                    <input
                        type="text"
                        className="border-1 border-black-[rgba(0,0,0,0.5)] text-[rgba(0,0,0,0.75)]-400 mb-[25px] w-[calc(100vw-72px)] rounded-[5px] bg-cream text-base placeholder:text-slate-700"
                        placeholder="Phone Number"
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required={true}
                    />
                    <input
                        type="text"
                        className="border-1 border-black-[rgba(0,0,0,0.5)] text-[rgba(0,0,0,0.75)]-400 mb-[25px] w-[calc(100vw-72px)] rounded-[5px] bg-cream text-base placeholder:text-slate-700"
                        placeholder="Additional Phone Number (optional)"
                        onChange={(e) =>
                            setPhoneNumberAdditional1(e.target.value)
                        }
                        required={false}
                    />
                    <input
                        type="text"
                        className="border-1 border-black-[rgba(0,0,0,0.5)] text-[rgba(0,0,0,0.75)]-400 mb-[25px] w-[calc(100vw-72px)] rounded-[5px] bg-cream text-base placeholder:text-slate-700"
                        placeholder="Second Additional Phone Number (optional)"
                        onChange={(e) =>
                            setPhoneNumberAdditional2(e.target.value)
                        }
                        required={false}
                    />
                    <input
                        type="text"
                        className="border-1 border-black-[rgba(0,0,0,0.5)] text-[rgba(0,0,0,0.75)]-400 mb-[25px] w-[calc(100vw-72px)] rounded-[5px] bg-cream text-base placeholder:text-slate-700"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        required={true}
                    />
                    <input
                        type="text"
                        className="border-1 border-black-[rgba(0,0,0,0.5)] text-[rgba(0,0,0,0.75)]-400 mb-[25px] w-[calc(100vw-72px)] rounded-[5px] bg-cream text-base placeholder:text-slate-700"
                        placeholder="Additional Email (optional)"
                        onChange={(e) => setEmailAdditional(e.target.value)}
                        required={false}
                    />

                    <input
                        type="text"
                        className="border-1 border-black-[rgba(0,0,0,0.5)] text-[rgba(0,0,0,0.75)]-400 mb-[25px] w-[calc(100vw-72px)] rounded-[5px] bg-cream text-base placeholder:text-slate-700"
                        placeholder="Street Address (optional)"
                        onChange={(e) => setStreetAddress(e.target.value)}
                        required={false}
                    />
                    <input
                        type="text"
                        className="border-1 border-black-[rgba(0,0,0,0.5)] text-[rgba(0,0,0,0.75)]-400 mb-[25px] w-[calc(100vw-72px)] rounded-[5px] bg-cream text-base placeholder:text-slate-700"
                        placeholder="Apartment, suite, etc. (optional)"
                        onChange={(e) => setApartmentSuite(e.target.value)}
                        required={false}
                    />
                    <input
                        type="text"
                        className="border-1 border-black-[rgba(0,0,0,0.5)] text-[rgba(0,0,0,0.75)]-400 mb-[25px] w-[calc(100vw-72px)] rounded-[5px] bg-cream text-base placeholder:text-slate-700"
                        placeholder="City (optional)"
                        onChange={(e) => setCity(e.target.value)}
                        required={false}
                    />
                    <input
                        type="text"
                        className="border-1 border-black-[rgba(0,0,0,0.5)] text-[rgba(0,0,0,0.75)]-400 mb-[25px] w-[calc(100vw-72px)] rounded-[5px] bg-cream text-base placeholder:text-slate-700"
                        placeholder="State (optional)"
                        onChange={(e) => setState(e.target.value)}
                        required={false}
                    />
                    <input
                        type="text"
                        className="border-1 border-black-[rgba(0,0,0,0.5)] text-[rgba(0,0,0,0.75)]-400 mb-[25px] w-[calc(100vw-72px)] rounded-[5px] bg-cream text-base placeholder:text-slate-700"
                        placeholder="Zip Code (optional)"
                        onChange={(e) => setZipcode(e.target.value)}
                        required={false}
                    />

                    {/* Show errors in red */}

                    {errors.map((error, index) => (
                        <p className="text-red-500" key={index}>
                            {error}
                        </p>
                    ))}

                    <button
                        className="bottom-[36px] h-[48px] w-[100%] bg-dark-purple text-cream"
                        onClick={(e) => verifyForm(e)}
                    >
                        CONTINUE
                    </button>
                </div>
            </div>
        </>
    );
}
