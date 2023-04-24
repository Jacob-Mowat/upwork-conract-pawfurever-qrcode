"use client";

import { LoadingSpinner } from "@/src/components/LoadingSpinner.component";
import { useEffect, useState } from "react";
import {
    OwnerDetailsType,
    OwnerType,
    TagDetailsType,
    TagType,
} from "../../models/types";
import { Navbar } from "@/src/components/NavBar.component";
import { RedirectToSignIn, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import TagSetupKeyView from "@/src/components/tags/TagSetupKeyView.component";
import OwnerAddDetailsView from "@/src/components/owner/OwnerAddDetailsView.component";

export default function SetupView({ params }: { params: { token: string } }) {
    const [owner, setOwner] = useState<OwnerType>();
    const [tag, setTag] = useState<TagType>();

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
                console.log("Owner is set");
            }
        }

        if (!tag) {
            getTagData(params.token).then((data) => {
                if (data.status === 200) {
                    setTag(data.body.tag);
                } else {
                    return;
                }
            });
        } else {
            console.log("Tag is set");
        }
    }, [clerkAuth, owner, params, tag]);

    if (!clerkAuth.isSignedIn) {
        return <RedirectToSignIn />;
    }

    return (
        <>
            <Navbar />
            <div className="flex h-[calc(100vh-64px)] overflow-auto justify-center items-center">
                <div className="text-center">
                    <div>
                        {owner == null || tag == null ? (
                            <LoadingSpinner />
                        ) : (
                            <>
                                <SignedIn>
                                    {owner.owner_details_id != null ? (
                                        <TagSetupKeyView
                                            tag={tag}
                                            owner={owner}
                                        />
                                    ) : (
                                        <OwnerAddDetailsView
                                            owner={owner}
                                            tag={tag}
                                        />
                                    )}
                                </SignedIn>
                                <SignedOut>
                                    <RedirectToSignIn />
                                </SignedOut>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
