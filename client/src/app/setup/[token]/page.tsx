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

interface TagViewProps {
    tag: any;
}

interface ExpectedDataType {
    tag: TagType;
    owner: OwnerType;
    owner_details: OwnerDetailsType;
    tag_details: TagDetailsType;
}

export default function SetupView({ params }: { params: { token: string } }) {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<ExpectedDataType>();

    useEffect(() => {
        if (isLoading) {
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

            getViewData(params.token).then((data) => {
                setIsLoading(false);
                setData(data.body);
            });
        }
    }, [isLoading, params]);

    if (isLoading && data == null) {
        return <LoadingSpinner />;
    }

    return (
        <>
            <Navbar />
            <div className="flex justify-center items-center">
                <div className="text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={data?.tag_details.pets_photo_url as string}
                        width="100%"
                        alt="Pet Photo"
                    />
                    <div className="mt-[25px]">
                        <h1 className="text-welcomeCustom">Hi! my name is,</h1>
                        <h2 className="text-dogName mb-[25px]">
                            {data?.tag_details.pets_name}
                        </h2>
                        <p>Thank you for finding me!</p>
                        <p className="mb-[25px]">
                            My owners name is,{" "}
                            <span>{data?.tag_details.tag_owners_name}</span>
                        </p>
                        <p className="mb-[25px]">please return me to them :)</p>
                        {data?.tag_details.pets_information}
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
        </>
    );
}
