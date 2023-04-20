"use client";
import { useState } from "react";
import styles from "./page.module.css";
import { RedirectToSignIn, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import TagAddDetailsView from "../tags/TagAddDetailsView.component";
import { OwnerType } from "@/src/app/models/types";

interface OwnerAddDetailsViewProps {
    owner: OwnerType;
}

export default function OwnerAddDetailsView({
    owner,
}: OwnerAddDetailsViewProps) {
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [addressline1, setAddressline1] = useState<string>("");
    const [addressline2, setAddressline2] = useState<string>("");
    const [zipcode, setZipcode] = useState<string>("");

    const user = useUser();

    const verifyForm = (e: any) => {};

    return (
        <>
            <div className="">
                <h1 className="top-0 text-headingCustom underline font-josefin text-black-400 text-center mb-[25px]">
                    Account Details
                </h1>

                <input
                    type="text"
                    className="border-1 border-black-400 bg-cream shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)] w-[calc(100vw-72px)] text-center font-josefin text-base text-[rgba(0,0,0,0.75)]-400 mb-[25px]"
                    placeholder="AAA-0000"
                    pattern="[A-Za-z]{4}-[0-9]{3}"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <input
                    type="text"
                    className="border-1 border-black-400 bg-cream shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)] w-[calc(100vw-72px)] text-center font-josefin text-base text-[rgba(0,0,0,0.75)]-400 mb-[25px]"
                    placeholder="AAA-0000"
                    pattern="[A-Za-z]{4}-[0-9]{3}"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <input
                    type="text"
                    className="border-1 border-black-400 bg-cream shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)] w-[calc(100vw-72px)] text-center font-josefin text-base text-[rgba(0,0,0,0.75)]-400 mb-[25px]"
                    placeholder="AAA-0000"
                    pattern="[A-Za-z]{4}-[0-9]{3}"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <input
                    type="text"
                    className="border-1 border-black-400 bg-cream shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)] w-[calc(100vw-72px)] text-center font-josefin text-base text-[rgba(0,0,0,0.75)]-400 mb-[25px]"
                    placeholder="AAA-0000"
                    pattern="[A-Za-z]{4}-[0-9]{3}"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <input
                    type="text"
                    className="border-1 border-black-400 bg-cream shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)] w-[calc(100vw-72px)] text-center font-josefin text-base text-[rgba(0,0,0,0.75)]-400 mb-[25px]"
                    placeholder="AAA-0000"
                    pattern="[A-Za-z]{4}-[0-9]{3}"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <input
                    type="text"
                    className="border-1 border-black-400 bg-cream shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)] w-[calc(100vw-72px)] text-center font-josefin text-base text-[rgba(0,0,0,0.75)]-400 mb-[25px]"
                    placeholder="AAA-0000"
                    pattern="[A-Za-z]{4}-[0-9]{3}"
                    onChange={(e) => setPhoneNumber(e.target.value)}
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
