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
                    to: [{ email: data?.tag_details.parent_email as string }],
                    subject: "Hello from Mailtrap!",
                    text: "Welcome to Mailtrap Sending!",
                })
                .then(console.log, console.error);
        }
    }, [data?.tag_details.parent_email, isLoading, params, router]);

    return (
        <>
            {isLoading && data == null ? (
                <LoadingSpinner display_text="Loading Tag..." />
            ) : (
                <div className="h-full items-center justify-center bg-white">
                    <div className="flex h-[20%] flex-row justify-between align-middle">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={
                                (data?.tag_details.photo_url as string) ||
                                "https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=612x612&w=0&k=20&c=KuCo-dRBYV7nz2gbk4J9w1WtTAgpTdznHu55W9FjimE="
                            }
                            alt="Pet Photo"
                            className="absolute z-40 ml-[15%] mt-[5%] h-[150px] w-[150px] shrink-0 grow-0 rounded-full object-cover md:h-[225px] md:w-[225px] lg:h-[300px] lg:w-[300px]"
                        />
                        <div className="absolute right-0 mr-[15%] mt-[15%] text-4xl font-bold">
                            {data?.tag_details.name.toUpperCase()}
                        </div>
                    </div>
                    <div className="mt-[25%] flex h-[90%] flex-col items-center justify-center bg-cream p-10">
                        {/* <div className="overflow-x-hidden">
                            <div className="absolute bottom-0 ml-[-50%] mt-[25px] h-[90%] w-[200%] rounded-t-[50%] bg-cream px-10">
                            </div>
                            </div> */}
                        <div className="w-[90%] py-10 text-center text-lg md:w-[70%] lg:w-[50%]">
                            {data?.tag_details.bio}
                        </div>

                        <div className="w-[90%] py-10 md:w-[70%] lg:w-[50%]">
                            <div className="text-2xl font-bold">
                                {data?.tag_details.name}&apos;s Information:
                            </div>

                            <div className="flex flex-col px-1 py-2">
                                {data?.tag_details.birthday && (
                                    <div className="flex flex-row justify-between border-b-2 border-[#CAB7B7]">
                                        <div className="text-[#CAB7B7]">
                                            Pet Birthday
                                        </div>
                                        <div>
                                            {new Date(
                                                data?.tag_details
                                                    .birthday as string
                                            ).getMonth() + 1}
                                            /
                                            {new Date(
                                                data?.tag_details
                                                    .birthday as string
                                            ).getDate()}
                                            /
                                            {new Date(
                                                data?.tag_details
                                                    .birthday as string
                                            ).getFullYear()}
                                        </div>
                                    </div>
                                )}
                                {data?.tag_details.breed && (
                                    <div className="flex flex-row justify-between border-b-2 border-[#CAB7B7] pt-1">
                                        <div className="text-[#CAB7B7]">
                                            Breed
                                        </div>
                                        <div>{data?.tag_details.breed}</div>
                                    </div>
                                )}
                                {data?.tag_details.gender && (
                                    <div className="flex flex-row justify-between border-b-2 border-[#CAB7B7] pt-1">
                                        <div className="text-[#CAB7B7]">
                                            Gender
                                        </div>
                                        <div>{data?.tag_details.gender}</div>
                                    </div>
                                )}
                                {data?.tag_details.microchip_number && (
                                    <div className="flex flex-row justify-between border-b-2 border-[#CAB7B7] pt-1">
                                        <div className="text-[#CAB7B7]">
                                            Microchip
                                        </div>
                                        <div>
                                            {data?.tag_details.microchip_number}
                                        </div>
                                    </div>
                                )}
                                {data?.tag_details.neutered_spayed && (
                                    <div className="flex flex-row justify-between border-b-2 border-[#CAB7B7] pt-1">
                                        <div className="text-[#CAB7B7]">
                                            Neutered/Spayed
                                        </div>
                                        <div>
                                            {data?.tag_details.neutered_spayed
                                                ? "Yes"
                                                : "No"}
                                        </div>
                                    </div>
                                )}
                                {data?.tag_details.behaviour && (
                                    <div className="flex flex-row justify-between border-b-2 border-[#CAB7B7] pt-1">
                                        <div className="text-[#CAB7B7]">
                                            Behaviour
                                        </div>
                                        <div>{data?.tag_details.behaviour}</div>
                                    </div>
                                )}
                                {data?.tag_details.allergies && (
                                    <div className="flex flex-row justify-between border-b-2 border-[#CAB7B7] pt-1">
                                        <div className="text-[#CAB7B7]">
                                            Allergies
                                        </div>
                                        <div>{data?.tag_details.allergies}</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="w-[90%] py-10 md:w-[70%] lg:w-[50%]">
                            <div className="text-2xl font-bold">
                                Parent&apos;s Information:
                            </div>

                            <div className="flex flex-col px-1 py-2">
                                {data?.tag_details.parent_name && (
                                    <div className="flex flex-row justify-between border-b-2 border-[#CAB7B7]">
                                        <div className="text-[#CAB7B7]">
                                            Name
                                        </div>
                                        <div>
                                            {data?.tag_details.parent_name}
                                        </div>
                                    </div>
                                )}
                                {data?.tag_details.parent_phone_number && (
                                    <div className="flex flex-row justify-between border-b-2 border-[#CAB7B7] pt-1">
                                        <div className="text-[#CAB7B7]">
                                            Phone Number
                                        </div>
                                        <div>
                                            {
                                                data?.tag_details
                                                    .parent_phone_number
                                            }
                                        </div>
                                    </div>
                                )}
                                {data?.tag_details
                                    .parent_phone_number_additional_1 && (
                                    <div className="flex flex-row justify-between border-b-2 border-[#CAB7B7] pt-1">
                                        <div className="text-[#CAB7B7]">
                                            Additional Phone Number
                                        </div>
                                        <div>
                                            {
                                                data?.tag_details
                                                    .parent_phone_number_additional_1
                                            }
                                        </div>
                                    </div>
                                )}
                                {data?.tag_details
                                    .parent_phone_number_additional_2 && (
                                    <div className="flex flex-row justify-between border-b-2 border-[#CAB7B7] pt-1">
                                        <div className="text-[#CAB7B7]">
                                            Additional Phone Number
                                        </div>
                                        <div>
                                            {
                                                data?.tag_details
                                                    .parent_phone_number_additional_2
                                            }
                                        </div>
                                    </div>
                                )}
                                {data?.tag_details.parent_email && (
                                    <div className="flex flex-row justify-between border-b-2 border-[#CAB7B7] pt-1">
                                        <div className="text-[#CAB7B7]">
                                            Email
                                        </div>
                                        <div>
                                            {data?.tag_details.parent_email}
                                        </div>
                                    </div>
                                )}
                                {data?.tag_details.parent_email_additional && (
                                    <div className="flex flex-row justify-between border-b-2 border-[#CAB7B7] pt-1">
                                        <div className="text-[#CAB7B7]">
                                            Additional Email
                                        </div>
                                        <div>
                                            {
                                                data?.tag_details
                                                    .parent_email_additional
                                            }
                                        </div>
                                    </div>
                                )}
                                {data?.tag_details.parent_street_address && (
                                    <div className="flex flex-row justify-between border-b-2 border-[#CAB7B7] pt-1">
                                        <div className="text-[#CAB7B7]">
                                            Street Address
                                        </div>
                                        <div>
                                            {
                                                data?.tag_details
                                                    .parent_street_address
                                            }
                                        </div>
                                    </div>
                                )}
                                {data?.tag_details.parent_apt_suite_unit && (
                                    <div className="flex flex-row justify-between border-b-2 border-[#CAB7B7] pt-1">
                                        <div className="text-[#CAB7B7]">
                                            Apt, Suite, etc.
                                        </div>
                                        <div>
                                            {
                                                data?.tag_details
                                                    .parent_apt_suite_unit
                                            }
                                        </div>
                                    </div>
                                )}
                                {data?.tag_details.parent_city && (
                                    <div className="flex flex-row justify-between border-b-2 border-[#CAB7B7] pt-1">
                                        <div className="text-[#CAB7B7]">
                                            City
                                        </div>
                                        <div>
                                            {data?.tag_details.parent_city}
                                        </div>
                                    </div>
                                )}
                                {data?.tag_details.parent_state && (
                                    <div className="flex flex-row justify-between border-b-2 border-[#CAB7B7] pt-1">
                                        <div className="text-[#CAB7B7]">
                                            State
                                        </div>
                                        <div>
                                            {data?.tag_details.parent_state}
                                        </div>
                                    </div>
                                )}
                                {data?.tag_details.parent_zipcode && (
                                    <div className="flex flex-row justify-between border-b-2 border-[#CAB7B7] pt-1">
                                        <div className="text-[#CAB7B7]">
                                            Zip Code
                                        </div>
                                        <div>
                                            {data?.tag_details.parent_zipcode}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="left-0 mb-[50px] mt-[25px] place-self-center text-sm font-light">
                            <Link
                                href={`/edit/${params.token}`}
                                className="underline hover:bg-lightest-purple"
                            >
                                Owner? click here to login and edit your tag
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
