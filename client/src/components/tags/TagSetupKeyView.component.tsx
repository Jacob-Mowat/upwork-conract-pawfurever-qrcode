"use client";
import { useState } from "react";
import { OwnerType, TagType } from "@/src/models/types";
import { useRouter } from "next/navigation";

interface TagSetupKeyViewProps {
    tag: TagType;
    owner: OwnerType;
}

export default function TagSetupKeyView({ tag, owner }: TagSetupKeyViewProps) {
    const [setupKey, setSetupKey] = useState<string>("");
    const [showError, setShowError] = useState<boolean>(false);

    const router = useRouter();

    const verifySetupKey = (e: any) => {
        e.preventDefault();

        if (setupKey === tag.setup_key) {
            registerTag();
        } else {
            console.log("Setup key does not match!");
            setShowError(true);
        }
    };

    const registerTag = async () => {
        const registerRequest = await fetch(
            `/api/register-tag?token=${tag.TAG_TOKEN}&ownerID=${owner.id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const registerResponse = await registerRequest.json();

        if (registerResponse.status === 200) {
            console.log("Redirecting back to tag setup page");
            // router.push(`/setup/${tag.TAG_TOKEN}`);
            const callback = `/setup/${tag.TAG_TOKEN}`;
            router.refresh();
            router.replace(callback);
        } else {
            console.log("Error registering tag");
        }
    };

    return (
        <>
            <div className="flex items-center justify-center">
                <div className="absolute top-[96px]">
                    <h1 className="text-headingCustom text-black-400  text-center underline">
                        Verify QR
                    </h1>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <span className="text-black-300  text-baseCustom p-[16px]">
                        Please enter the setup key shown below your QR tag
                    </span>
                    <input
                        type="text"
                        className="border-1 border-black-400 text-[rgba(0,0,0,0.75)]-400 w-[calc(100vw-72px)] bg-cream text-center  text-base shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)]"
                        placeholder="AAAA-###"
                        pattern="[A-Za-z]{4}-[0-9]{3}"
                        onChange={(e) => setSetupKey(e.target.value)}
                    />
                </div>
                <button
                    className="absolute bottom-[36px] h-[48px] w-[calc(100%-72px)] bg-dark-purple text-cream"
                    onClick={(e) => verifySetupKey(e)}
                >
                    CONTINUE
                </button>
            </div>
        </>
    );
}
