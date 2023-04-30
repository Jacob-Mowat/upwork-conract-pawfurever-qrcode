"use client";

import { LoadingSpinner } from "@/src/components/LoadingSpinner.component";
import { Key, useEffect, useState } from "react";
import { OwnerDetailsType, TagType } from "../models/types";
import { Navbar } from "@/src/components/NavBar.component";
import TagAddDetailsView from "@/src/components/tags/TagAddDetailsView.component";
import { RedirectToSignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { s3Client } from "@/lib/s3bucket";
import { FileUploader } from "react-drag-drop-files";
import { TagDetailsType } from "../models/types";
import { OwnedTagsListItem } from "@/src/components/tags/OwnedTagsListItem.component";

export default function CreateOwnerDetailsPage() {
    const [loadingData, setLoadingData] = useState(true);
    const [data, setData] = useState<{
        tags: TagType[];
        tag_details: TagDetailsType[];
    }>({ tags: [], tag_details: [] });

    const router = useRouter();
    const { user } = useUser();

    useEffect(() => {
        const getOwnedTags = async (uID: string) => {
            const request = await fetch(`/api/tags/owned/?uID=${uID}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const response = await request.json();

            console.log(response);

            return {
                tags: response.body.tags as TagType[],
                tag_details: response.body.tag_details as TagDetailsType[],
            };
        };

        if (loadingData) {
            if (user) {
                getOwnedTags(user.id).then((data) => {
                    setData(data);
                    setLoadingData(false);
                    console.log(data);
                });
            }
        }
    }, [loadingData, user]);

    if (loadingData) {
        return <LoadingSpinner display_text="Loading your Tags..." />;
    }

    if (!data.tags) {
        return <LoadingSpinner display_text="Loading your Tags..." />;
    }

    if (!user) {
        return <RedirectToSignIn />;
    }

    return (
        <>
            <Navbar page="mytags" />
            <div className="flex overflow-auto justify-center items-center">
                <div className="flex flex-col w-full justify-center items-center p-4">
                    <div className="text-center p-4">
                        <h1 className="text-4xl underline text-black-400 text-center">
                            Your Tags
                        </h1>
                    </div>
                    <div className="flex w-[100%] flex-col items-center justify-center">
                        {data.tags.length == 0 ? (
                            <h1 className="text-2xl font-bold">
                                You dont own any tags!
                            </h1>
                        ) : (
                            <>
                                {data.tags.map((tag, i) => {
                                    if (
                                        data.tag_details.filter(
                                            (td) => td.id === tag.tag_details_id
                                        )[0] == null
                                    ) {
                                        return null;
                                    } else {
                                        return (
                                            <OwnedTagsListItem
                                                tag={tag}
                                                key={tag.id as Key}
                                                tag_details={
                                                    data.tag_details.filter(
                                                        (td) =>
                                                            td.id ===
                                                            tag.tag_details_id
                                                    )[0]
                                                }
                                            />
                                        );
                                    }
                                })}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
