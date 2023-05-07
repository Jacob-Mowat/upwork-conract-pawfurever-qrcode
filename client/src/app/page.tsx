/* eslint-disable react/no-unescaped-entities */
"use client";
import { useSearchParams } from "next/navigation";
import { RedirectToSignIn, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useState, useEffect, useCallback, use } from "react";

// Import the components
import TagSetupKeyView from "../components/tags/TagSetupKeyView.component";
import TagView from "../components/tags/TagView.component";
import TagAddDetailsView from "../components/tags/TagAddDetailsView.component";
import TagsListView from "../components/tags/TagsListView.component";
import OwnerAddDetailsView from "../components/owner/OwnerAddDetailsView.component";

import { OwnerType, TagType } from "../models/types";
import { LoadingSpinner } from "../components/LoadingSpinner.component";
import { OwnedTagsListView } from "../components/tags/OwnedTagsListView.component";
import { Navbar } from "../components/NavBar.component";

export default function Home() {
    // States
    const [isLoading, setIsLoading] = useState<Boolean>(false);
    const [loadingOwnerData, setLoadingOwnerData] = useState<Boolean>(false);
    const [ownerDetails, setOwnerDetails] = useState();

    const [tag, setTag] = useState<TagType>();
    const [owner, setOwner] = useState<OwnerType>();

    const params = useSearchParams();
    const user = useUser();

    const token: String = params.get("token") || "";

    const getTag = async (token: String) => {
        if (token == "") return { body: {} };

        const tagRequest = await fetch(`/api/tags?token=${token}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        return await tagRequest.json();
    };

    const getOrCreateOwner = async (userID: string) => {
        if (userID == "") {
            console.log("No user ID provided");
            return null;
        }

        // Check API for owner with a user_id: userID
        const findOwnerRequest = await fetch(`/api/owners/?uID=${userID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const findOwnerResponse = await findOwnerRequest.json();

        if (findOwnerResponse.body.status == 200) {
            console.log("Owner has already been registered.");
            return await findOwnerResponse.body.owner;
        } else {
            if (findOwnerResponse.body.error == "No Owner found") {
                // Create new Owner record
                const createNewOwnerRequest = await fetch(
                    `/api/owners/create`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ user_id: userID }),
                    }
                );

                const createNewOwnerResponse =
                    await createNewOwnerRequest.json();

                if (createNewOwnerResponse.body.status == 200) {
                    return await createNewOwnerResponse.body.owner;
                } else {
                    console.log(await createNewOwnerResponse.body.error);
                    return null;
                }
            } else {
                return await findOwnerResponse.body.owner;
            }
        }

        return null;
    };

    const getOwnerById = async (ownerID: string) => {
        const ownerData = await fetch(`/api/owners/?ownerID=${ownerID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const ownerDataResponse = await ownerData.json();

        if (ownerDataResponse.body.status == 200) {
            return await ownerDataResponse.body.owner;
        } else {
            console.log(await ownerDataResponse.body.error);
            return null;
        }
    };

    const getOwnerDetails = async (ownerID: string) => {
        if (ownerID == "") return null;

        const ownerDetailsRequest = await fetch(
            `/api/owner-details/?ownerID=${ownerID}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const ownerDetailsResponse = await ownerDetailsRequest.json();
    };

    useEffect(() => {
        async function fetchData() {
            if (token && isLoading) {
                const tagData = await getTag(token);
                setTag(tagData.body.tag);
                setIsLoading(false);
            }

            if (loadingOwnerData) {
                if (user.isSignedIn) {
                    const foundOwner = await getOrCreateOwner(user.user.id);
                    console.log(foundOwner);

                    if (!foundOwner) {
                        console.log("Issue occurred getting/creating Owner");
                        return;
                    }

                    setLoadingOwnerData(false);
                    setOwner(foundOwner);
                } else {
                    if (isLoading) {
                        return;
                    } else {
                        const foundOwner = await getOwnerById(
                            tag?.owner_id as string
                        );
                        console.log(foundOwner);

                        if (!foundOwner) {
                            console.log(
                                "Issue occurred getting/creating Owner"
                            );
                            return;
                        }

                        setLoadingOwnerData(false);
                        setOwner(foundOwner);
                    }
                }
            }
        }

        fetchData();
    }, [token, user, loadingOwnerData, isLoading, tag]);

    return (
        <>
            <Navbar page="home" />
            <div className="flex h-[calc(100vh-72px)] overflow-auto justify-center items-center">
                <div className="text-center">
                    <div>
                        <div className="flex flex-col items-center">
                            <h1 className="font-">
                                Scan a QR Tag to get started.
                            </h1>

                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/qr-tag-example.svg"
                                className="w-1/2 h-1/2"
                                alt="QR Tag Example"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
