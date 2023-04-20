"use client";
import { useState } from "react";
import styles from "./page.module.css";
import { RedirectToSignIn, SignedIn, SignedOut, useUser } from "@clerk/nextjs";

interface TagAddDetailsViewProps {
    tag: any;
}

export default function TagAddDetailsView({ tag }: TagAddDetailsViewProps) {
    const [petName, setPetName] = useState<string>("");
    const [extraInformation, setExtraInformation] = useState<string>("");
    const [useOwnerDetails, setUseOwnerDetails] = useState<boolean>(false);

    return (
        <>
            <div className="">
                <h1 className="top-0 text-headingCustom underline font-josefin text-black-400 text-center mb-[25px]">
                    Account Details
                </h1>

                <input
                    type="text"
                    className="border-1 border-black-400 bg-cream shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)] w-[calc(100vw-72px)] font-josefin text-base text-[rgba(0,0,0,0.75)]-400 mb-[25px]"
                    placeholder="Pet name"
                    onChange={(e) => setPetName(e.target.value)}
                />
                <input
                    type="text"
                    className="border-1 border-black-400 bg-cream shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)] w-[calc(100vw-72px)] font-josefin text-base text-[rgba(0,0,0,0.75)]-400 mb-[25px]"
                    placeholder="Lastname"
                    onChange={(e) => setLastname(e.target.value)}
                />
                <input
                    type="text"
                    className="border-1 border-black-400 bg-cream shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)] w-[calc(100vw-72px)] font-josefin text-base text-[rgba(0,0,0,0.75)]-400 mb-[25px]"
                    placeholder="Phone number"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <input
                    type="text"
                    className="border-1 border-black-400 bg-cream shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)] w-[calc(100vw-72px)] font-josefin text-base text-[rgba(0,0,0,0.75)]-400 mb-[25px]"
                    placeholder="Address line 1"
                    onChange={(e) => setAddressline1(e.target.value)}
                />
                <input
                    type="text"
                    className="border-1 border-black-400 bg-cream shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)] w-[calc(100vw-72px)] font-josefin text-base text-[rgba(0,0,0,0.75)]-400 mb-[25px]"
                    placeholder="Address line 2"
                    onChange={(e) => setAddressline2(e.target.value)}
                />
                <input
                    type="text"
                    className="border-1 border-black-400 bg-cream shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)] w-[calc(100vw-72px)] font-josefin text-base text-[rgba(0,0,0,0.75)]-400 mb-[25px]"
                    placeholder="Zipcode"
                    onChange={(e) => setZipcode(e.target.value)}
                />

                <button
                    className="bottom-[36px] w-[calc(100%-72px)] bg-dark-purple text-cream h-[48px]"
                    onClick={(e) => verifyForm(e)}
                >
                    CONTINUE
                </button>
            </div>
        </>
    );
}
