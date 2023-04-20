"use client";
import { useState } from "react";
import TagAddDetailsView from "./TagAddDetailsView.component";
import { OwnerType, TagType } from "@/src/app/models/types";

interface TagSetupKeyViewProps {
    tag: TagType;
    owner: OwnerType;
}

export default function TagSetupKeyView({ tag, owner }: TagSetupKeyViewProps) {
    const [setupKey, setSetupKey] = useState<string>("");
    const [validSetupKey, setValidSetupKey] = useState<boolean>(false);

    const verifySetupKey = (e: any) => {
        e.preventDefault();

        if (setupKey === tag.setup_key) {
            registerTag();
            setValidSetupKey(true);
        } else {
            console.log("Setup key does not match!");
            setValidSetupKey(false);
        }
    };

    const registerTag = async () => {
        const registerRequest = await fetch(
            `/api/register-tag/?token=${tag.TAG_TOKEN}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const registerResponse = await registerRequest.json();

        if (registerResponse.status === 200) {
            setValidSetupKey(true);
        } else {
            console.log("Error registering tag");
        }
    };

    return (
        <>
            {!validSetupKey ? (
                <div className="flex justify-center items-center">
                    <div className="absolute top-[96px]">
                        <h1 className="text-headingCustom underline font-josefin text-black-400 text-center">
                            Verify QR
                        </h1>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <span className="text-black-300 font-josefin text-baseCustom p-[16px]">
                            Please enter the setup key shown below your QR tag
                        </span>
                        <input
                            type="text"
                            className="border-1 border-black-400 bg-cream shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)] w-[calc(100vw-72px)] text-center font-josefin text-base text-[rgba(0,0,0,0.75)]-400"
                            placeholder="AAA-0000"
                            pattern="[A-Za-z]{3}-[0-9]{4}"
                            onChange={(e) => setSetupKey(e.target.value)}
                        />
                    </div>
                    <button
                        className="absolute bottom-[36px] w-[calc(100%-72px)] bg-dark-purple text-cream h-[48px]"
                        onClick={(e) => verifySetupKey(e)}
                    >
                        CONTINUE
                    </button>
                </div>
            ) : (
                <TagAddDetailsView tag={tag} />
            )}
        </>
    );
}
