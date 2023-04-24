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
import { useRouter } from "next/navigation";

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
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<ExpectedDataType>();

    const router = useRouter();

    useEffect(() => {
        if (isLoading) {
            const checkIfRegistered = async (token: string) => {
                const request = await fetch(
                    `/api/isTokenRegistered?token=${token}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                const response = await request.json();

                console.log(response);

                return response;
            };

            const getViewData = async (token: string) => {
                const request = await fetch(`/api/tags/view/?token=${token}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const response = await request.json();

                console.log(response);

                return response;
            };

            checkIfRegistered(params.token).then((data) => {
                if (
                    data.body.tag.registered &&
                    data.body.tag.tag_details_id !== null
                ) {
                    console.log("Token is registered, proceeding to view");
                    getViewData(params.token).then((data) => {
                        setIsLoading(false);
                        setData(data.body);
                    });
                } else {
                    router.push(`/setup/${params.token}`);
                }
            });
        }
    }, [isLoading, params, router]);

    return (
        <>
            <Navbar />
            {isLoading && data == null ? (
                <LoadingSpinner />
            ) : (
                <div className="flex justify-center items-center">
                    <div className="text-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={data?.tag_details.pets_photo_url as string}
                            alt="Pet Photo"
                            height="60%"
                        />

                        <div className="overflow-x-hidden">
                            <div className="absolute border border-t-cream bottom-0 mt-[25px] ml-[-50%] h-[55%] w-[200%] rounded-t-[100%] bg-gradient-to-b from-cream via-cream to-cream">
                                <div className="mt-[50px] text-center text-2xl">
                                    <h1 className="text-welcomeCustom">
                                        Hi! my name is,
                                    </h1>
                                    <h2 className="text-dogName mb-[25px]">
                                        {data?.tag_details.pets_name}
                                    </h2>
                                    <p>Thank you for finding me!</p>
                                    <p className="mb-[25px]">
                                        My owners name is,{" "}
                                        <span>
                                            {data?.tag_details.tag_owners_name}
                                        </span>
                                    </p>
                                    <p className="mb-[25px]">
                                        please return me to them :)
                                    </p>
                                    <p className="mb-[25px]">
                                        {data?.tag_details.pets_information}
                                    </p>
                                    <p>{data?.tag_details.tag_address_line1}</p>
                                    <p>{data?.tag_details.tag_address_line2}</p>
                                    <p className="mb-[25px]">
                                        {data?.tag_details.tag_address_zip}
                                    </p>
                                    <p>{data?.tag_details.tag_phone_number}</p>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
