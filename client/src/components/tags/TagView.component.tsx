"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { RedirectToSignIn, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { LoadingSpinner } from "../LoadingSpinner.component";

interface TagViewProps {
    tag: any;
}

export default function TagView({ tag }: TagViewProps) {
    const user = useUser();

    const [loadingData, setLoadingData] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        if (loadingData) {
            const getViewData = async (tagID: string) => {
                const request = await fetch(`/api/tags/view/?tagID=${tagID}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const response = await request.json();

                console.log(response);

                return response;
            };

            getViewData(tag.id).then((data) => {
                setLoadingData(false);
                setData(data);
            });
        }
    }, [loadingData, tag]);

    return (
        <>
            {data == null ? (
                <LoadingSpinner />
            ) : (
                <div className="flex justify-center items-center">
                    <div className="text-center">
                        <img
                            src={data.body.tag_details.pets_photo_url}
                            width="100%"
                        />
                        <div className="mt-[25px]">
                            <h1 className="text-welcomeCustom">
                                Hi! my name is,
                            </h1>
                            <h2 className="text-dogName mb-[25px]">
                                {data.body.tag_details.pets_name}
                            </h2>
                            <p>Thank you for finding me!</p>
                            <p className="mb-[25px]">
                                My owners name is,{" "}
                                <span>
                                    {data.body.tag_details.tag_owners_name}
                                </span>
                            </p>
                            <p className="mb-[25px]">
                                please return me to them :)
                            </p>
                            <p>{data.body.tag_details.tag_address_line1}</p>
                            <p>{data.body.tag_details.tag_address_line2}</p>
                            <p>{data.body.tag_details.tag_address_zip}</p>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
