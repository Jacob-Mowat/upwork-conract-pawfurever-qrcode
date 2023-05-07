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
import { SideBar } from "@/src/components/SideBar.component";
import { MailtrapClient } from "mailtrap";
import Link from "next/link";
import { BsFillTelephoneFill } from "react-icons/bs";

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
        } else {
            console.log("Data has been loaded");

            const { MailtrapClient } = require("mailtrap");

            const ENDPOINT = "https://send.api.mailtrap.io/";
            const SENDER_EMAIL = "mailtrap@qr.mowat.dev";

            // Send email to owner to notify them the tag has been viewed/scanned.
            const client = new MailtrapClient({
                endpoint: ENDPOINT,
                token: process.env.NEXT_PUBLIC_MAILTRAP_API_TOKEN as string,
            });

            const sender = { name: "Mailtrap Test", email: SENDER_EMAIL };

            client
                .send({
                    from: sender,
                    to: [{ email: data?.tag_details.tag_email as string }],
                    subject: "Hello from Mailtrap!",
                    text: "Welcome to Mailtrap Sending!",
                })
                .then(console.log, console.error);
        }
    }, [data?.tag_details.tag_email, isLoading, params, router]);

    return (
        <>
            <Navbar />
            <SideBar />
            {isLoading && data == null ? (
                <LoadingSpinner display_text="Loading Tag..." />
            ) : (
                <div className="flex justify-center items-center">
                    <div className="justify-center items-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={
                                (data?.tag_details.pets_photo_url as string) ||
                                "https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=612x612&w=0&k=20&c=KuCo-dRBYV7nz2gbk4J9w1WtTAgpTdznHu55W9FjimE="
                            }
                            alt="Pet Photo"
                            height="60%"
                        />

                        <div className="overflow-x-hidden">
                            <div className="absolute bottom-0 mt-[25px] ml-[-50%] h-[55%] w-[200%] rounded-t-[50%] bg-gradient-to-b from-cream via-cream to-cream">
                                <div className="mt-[30px] md:mt-[50px] text-center">
                                    <div className="text-xl md:text-welcomeCustom font-thin ">
                                        Hi! my name is,
                                    </div>
                                    <div className="text-4xl mb-[15px] font-thin">
                                        {data?.tag_details.pets_name}
                                    </div>
                                    <div className="text-xl mb-[25px] w-[40%] translate-x-[75%]">
                                        Thank you for finding me! <br />
                                        My owner is:
                                    </div>
                                    <div className="mb-[25px] text-center">
                                        {data?.tag_details.tag_owners_name}
                                        <br />
                                        {data?.tag_details.tag_address_line1}
                                        <br />
                                        {data?.tag_details.tag_address_line2}
                                        <br />
                                        {data?.tag_details.tag_address_zip}
                                    </div>

                                    <div>
                                        Main phone number:{" "}
                                        <a
                                            href={`tel:${data?.tag_details.tag_phone_number}`}
                                            className="underline hover:bg-lightest-purple hover:text-purple"
                                        >
                                            {data?.tag_details.tag_phone_number}{" "}
                                            <BsFillTelephoneFill />
                                        </a>
                                    </div>
                                    {data?.tag_details.tag_phone_number2 && (
                                        <div>
                                            Second phone number:{" "}
                                            <a
                                                href={`tel:${data?.tag_details.tag_phone_number2}`}
                                                className="underline"
                                            >
                                                {
                                                    data?.tag_details
                                                        .tag_phone_number2
                                                }
                                            </a>
                                        </div>
                                    )}

                                    {data?.tag_details.pets_information && (
                                        <div className="mt-[25px] mb-[25px]">
                                            <div className="text-xl mb-[15px] font-thin">
                                                Extra information:
                                            </div>
                                            <div className="text-md mb-[15px] font-thin">
                                                {
                                                    data?.tag_details
                                                        .pets_information
                                                }
                                            </div>
                                        </div>
                                    )}

                                    {/* <div className="mt-[25px]">
                                        <Link
                                            href={`/edit/${params.token}`}
                                            className="hover:bg-lightest-purple hover:text-purple underline"
                                        >
                                            <button className="bg-purple px-16 py-4 text-2xl">
                                                Call Owner
                                            </button>
                                        </Link>
                                    </div> */}

                                    <div className="mb-[50px] left-0 mt-[25px] font-light text-sm place-self-center">
                                        <Link
                                            href={`/edit/${params.token}`}
                                            className="hover:bg-lightest-purple underline"
                                        >
                                            Owner? click here to login and edit
                                            your tag :)
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
