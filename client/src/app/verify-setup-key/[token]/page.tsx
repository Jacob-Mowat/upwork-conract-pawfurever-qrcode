"use client";

import { LoadingSpinner } from "@/src/components/LoadingSpinner.component";
import { useEffect, useState } from "react";
import {
    OwnerDetailsType,
    OwnerType,
    TagDetailsType,
    TagType,
} from "../../../models/types";
import { Navbar } from "@/src/components/NavBar.component";
import { useRouter } from "next/navigation";
import { RedirectToSignIn, useUser } from "@clerk/nextjs";

interface TagViewProps {
    tag: any;
}

interface ExpectedDataType {
    tag: TagType;
    owner: OwnerType;
    owner_details: OwnerDetailsType;
    tag_details: TagDetailsType;
}

export default function ViewPage({ params }: { params: { token: string } }) {
    const [owner, setOwner] = useState<OwnerType>();
    const [tag, setTag] = useState<TagType>();

    const [setupKey, setSetupKey] = useState<string>("");
    const [showError, setShowError] = useState<boolean>(false);

    const router = useRouter();
    const clerkAuth = useUser();

    useEffect(() => {
        const checkOwnerExistsAndRetrieve = async (user_id: string) => {
            const request = await fetch(`/api/owners/byUserId?uID=${user_id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const response = await request.json();

            console.log(response);

            return response;
        };

        const createNewOwner = async (user_id: string) => {
            const request = await fetch(`/api/owners/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: user_id,
                }),
            });

            const response = await request.json();

            console.log(response);

            return response;
        };

        const getTagData = async (token: string) => {
            const request = await fetch(`/api/tags?token=${token}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const response = await request.json();

            console.log(response);

            return response;
        };

        if (clerkAuth.user) {
            if (!owner) {
                checkOwnerExistsAndRetrieve(clerkAuth.user.id).then((data) => {
                    if (
                        data.status === 500 &&
                        data.body.error === "No Owner found"
                    ) {
                        // Send request to create owner
                        createNewOwner(clerkAuth.user.id).then((data) => {
                            if (data.status === 200) {
                                setOwner(data.body.owner);
                            } else {
                                return;
                            }
                        });
                    } else {
                        setOwner(data.body.owner);
                    }
                });
            } else {
                if (owner.owner_details_id != null) {
                    // show tag setup key view
                } else {
                    // show owner add details view
                }

                console.log("Owner is set");
            }
        }

        if (!tag) {
            getTagData(params.token).then((data) => {
                if (data.status === 200) {
                    if (data.body.tag.registered) {
                        router.push(
                            `/create/tag_details/${data.body.tag.TAG_TOKEN}`
                        );
                    }

                    setTag(data.body.tag);
                } else {
                    return;
                }
            });
        } else {
            console.log("Tag is set");
        }
    }, [clerkAuth, owner, params, router, tag]);

    const verifySetupKey = (e: any) => {
        e.preventDefault();

        if (tag) {
            if (setupKey === tag.setup_key) {
                registerTag();
            } else {
                console.log("Setup key does not match!");
                setShowError(true);
            }
        }
    };

    const registerTag = async () => {
        const registerRequest = await fetch(
            `/api/register-tag?token=${tag?.TAG_TOKEN}&ownerID=${owner?.id}`,
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
            const callback = `/setup/${tag?.TAG_TOKEN}`;
            router.refresh();
            router.replace(callback);
        } else {
            console.log("Error registering tag");
        }
    };

    if (!clerkAuth.isSignedIn) {
        return <RedirectToSignIn />;
    }

    if (!owner) {
        return <LoadingSpinner display_text="Loading Owner data..." />;
    }

    if (!tag) {
        return <LoadingSpinner display_text="Loading Tag data..." />;
    }

    return (
        <>
            <Navbar />

            <div className="flex h-[calc(100vh-64px)] items-center justify-center overflow-auto">
                <div className="text-center">
                    <div className="flex items-center justify-center">
                        <div className="absolute top-[96px] mb-[25px] mt-[25px]">
                            <h1 className="text-black-400 text-center text-4xl">
                                Verify QR
                            </h1>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-black-300  text-baseCustom p-[16px]">
                                Please enter the setup key shown below your QR
                                tag
                            </span>
                            <input
                                type="text"
                                className="border-1 border-black-[rgba(0,0,0,0.5)] text-[rgba(0,0,0,0.75)]-400 w-[calc(100vw-72px)] rounded-[5px] bg-cream  text-center text-base uppercase"
                                placeholder="AAA-####"
                                pattern="[A-Za-z]{3}-[0-9]{4}"
                                value={setupKey}
                                maxLength={8}
                                onChange={(e) => {
                                    setSetupKey((e.target.value).toUpperCase());
                                    if (
                                        e.target.value.length === 4 &&
                                        e.target.value.includes("-")
                                    ) {
                                        setSetupKey(
                                            e.target.value.replace("-", "").toUpperCase()
                                        );
                                    }
                                    if (e.target.value.length === 3) {
                                        setSetupKey((e.target.value).toUpperCase() + "-");
                                    }
                                }}
                            />
                        </div>
                        {/* Show error if showError is true */}
                        {showError && (
                            <div className="absolute bottom-[96px]">
                                <span className="text-baseCustom text-red-400">
                                    Setup key does not match!
                                </span>
                            </div>
                        )}
                        <button
                            className="absolute bottom-[36px] h-[48px] w-[calc(100%-72px)] bg-dark-purple text-cream"
                            onClick={(e) => verifySetupKey(e)}
                        >
                            CONTINUE
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
