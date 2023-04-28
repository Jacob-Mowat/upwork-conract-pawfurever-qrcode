import { OwnerType, TagDetailsType, TagType } from "@/src/app/models/types";
import { Key, useEffect, useState } from "react";
import { LoadingSpinner } from "../LoadingSpinner.component";
import { OwnedTagsListItem } from "./OwnedTagsListItem.component";

export interface OwnedTagsListViewProps {
    owner: OwnerType;
}

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

export const OwnedTagsListView = ({ owner }: OwnedTagsListViewProps) => {
    const [loadingData, setLoadingData] = useState(true);
    const [data, setData] = useState<{
        tags: TagType[];
        tag_details: TagDetailsType[];
    }>({ tags: [], tag_details: [] });

    useEffect(() => {
        if (loadingData) {
            if (owner.user_id == null) {
                return;
            }

            getOwnedTags(owner.user_id as string).then((data) => {
                setLoadingData(false);
                setData(data);
                console.log(data);
            });
        }

        // return () => {
        //     setLoadingData(true);
        // };
    }, [loadingData, owner]);

    if (loadingData) {
        return <LoadingSpinner />;
    }

    return (
        <div>
            <div className="flex flex-col items-center justify-center"></div>
        </div>
    );
};
