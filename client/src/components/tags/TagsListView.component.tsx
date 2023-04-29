"use client";
import { useState } from "react";
import styles from "./page.module.css";
import { RedirectToSignIn, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import TagAddDetailsView from "./TagAddDetailsView.component";
import { TagType } from "../../app/models/types";

interface TagsListViewProps {
    tags: any;
}

export default function TagsListView({ tags }: TagsListViewProps) {
    const [setupKey, setSetupKey] = useState<string>("");
    const [validSetupKey, setValidSetupKey] = useState<boolean>(false);

    const user = useUser();

    return (
        <>
            <ul>
                {tags.forEach((tag: TagType) => {
                    <li>{tag.id}</li>;
                })}
            </ul>
        </>
    );
}
