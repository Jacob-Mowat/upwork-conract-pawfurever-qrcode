"use client";

import { LoadingSpinner } from "@/src/components/LoadingSpinner.component";
import { useEffect, useState } from "react";
import {
    OwnerDetailsType,
    OwnerType,
    TagDetailsType,
    TagType,
} from "../../../models/types";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
            const notifyOwner = async (token: string) => {
                const request = await fetch(`/api/tags/notifyOwnerByEmail?token=${token}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const response = await request.json();

                console.log(response);

                return response;
            };
            
            notifyOwner(params.token).then((data) => {
                console.log(data);
            });
        }
    }, [data?.tag_details.parent_email, isLoading, params, router]);

    return (
        <>
            {isLoading && data == null ? (
                <LoadingSpinner display_text="Loading Tag..." />
            ) : (
                <div className="h-full items-center justify-center bg-white">
                    <div className="flex flex-row justify-between items-center align-middle bg-pink px-[5%] py-[5%]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={
                                (data?.tag_details.photo_url as string) ||
                                "https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=612x612&w=0&k=20&c=KuCo-dRBYV7nz2gbk4J9w1WtTAgpTdznHu55W9FjimE="
                            }
                            alt="Pet Photo"
                            className="z-40 h-36 w-36
                            md:h-56 md:w-56 lg:h-72 lg:w-72 rounded-full object-cover
                            "
                        />
                        <div className="flex text-4xl font-bold h-[100%] justify-center align-middle z-40">
                            {data?.tag_details.name.toUpperCase()}
                        </div>
                    </div>
                    <div className="flex h-[90%] flex-col items-center justify-center bg-cream mt-[-10%] px-[2.5%]">
                        {/* <div className="overflow-x-hidden">
                            <div className="absolute bottom-0 ml-[-50%] mt-[25px] h-[90%] w-[200%] rounded-t-[50%] bg-cream px-10">
                            </div>
                            </div> */}
                        <div className="w-[90%] py-10 text-center text-lg md:w-[70%] lg:w-[50%]">
                            {data?.tag_details.bio}
                        </div>
                        
                        {(data?.tag_details.birthday || data?.tag_details.breed || data?.tag_details.gender || data?.tag_details.microchip_number || data?.tag_details.neutered_spayed || data?.tag_details.behaviour || data?.tag_details.allergies) && (
                            <>
                                <div className="w-[90%] py-10 md:w-[70%] lg:w-[50%]">
                                    <div className="text-2xl font-bold">
                                        {data?.tag_details.name}&apos;s Information:
                                    </div>

                                    <div className="flex flex-col px-1 py-2">
                                        {data?.tag_details.birthday && (
                                            <div className="flex flex-row justify-between border-b-2 border-[#CAB7B7]">
                                                <div className="text-[#CAB7B7] pr-2">
                                                    Pet Birthday
                                                </div>
                                                <div className="text-right pl-2" style={{ wordBreak: 'break-word' }}>
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
                                                <div className="text-[#CAB7B7] pr-2">
                                                    Breed
                                                </div>
                                                <div className="text-right pl-2" style={{ wordBreak: 'break-word' }}>{data?.tag_details.breed}</div>
                                            </div>
                                        )}
                                        {data?.tag_details.gender && (
                                            <div className="flex flex-row justify-between border-b-2 border-[#CAB7B7] pt-1">
                                                <div className="text-[#CAB7B7] pr-2">
                                                    Gender
                                                </div>
                                                <div className="text-right pl-2" style={{ wordBreak: 'break-word' }}>{data?.tag_details.gender}</div>
                                            </div>
                                        )}
                                        {data?.tag_details.microchip_number && (
                                            <div className="flex flex-row justify-between border-b-2 border-[#CAB7B7] pt-1">
                                                <div className="text-[#CAB7B7] pr-2">
                                                    Microchip
                                                </div>
                                                <div className="text-right pl-2" style={{ wordBreak: 'break-word' }}>
                                                    {data?.tag_details.microchip_number}
                                                </div>
                                            </div>
                                        )}
                                        {data?.tag_details.neutered_spayed && (
                                            <div className="flex flex-row justify-between border-b-2 border-[#CAB7B7] pt-1">
                                                <div className="text-[#CAB7B7] pr-2">
                                                    Neutered/Spayed
                                                </div>
                                                <div className="text-right pl-2" style={{ wordBreak: 'break-word' }}>
                                                    {data?.tag_details.neutered_spayed
                                                        ? "Yes"
                                                        : "No"}
                                                </div>
                                            </div>
                                        )}
                                        {data?.tag_details.behaviour && (
                                            <div className="flex flex-row justify-between border-b-2 border-[#CAB7B7] pt-1">
                                                <div className="text-[#CAB7B7] pr-2">
                                                    Behaviour
                                                </div>
                                                <div  className="text-right pl-2" style={{ wordBreak: 'break-word' }}>{data?.tag_details.behaviour}</div>
                                            </div>
                                        )}
                                        {data?.tag_details.allergies && (
                                            <div className="flex flex-row justify-between border-b-2 border-[#CAB7B7] pt-1">
                                                <div className="text-[#CAB7B7] pr-2">
                                                    Allergies
                                                </div>
                                                <div className="text-right pl-2" style={{ wordBreak: 'break-word' }}>{data?.tag_details.allergies}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="w-[90%] py-10 md:w-[70%] lg:w-[50%]">
                            <div className="text-2xl font-bold">
                                Parent&apos;s Information:
                            </div>

                            <div className="flex flex-col px-1 py-2">
                                {data?.tag_details.parent_name && (
                                    <div className="flex flex-row justify-between border-b-2 border-[#CAB7B7]">
                                        <div className="text-[#CAB7B7] pr-2">
                                            Name
                                        </div>
                                        <div className="text-right pl-2" style={{ wordBreak: 'break-word' }}>
                                            {data?.tag_details.parent_name}
                                        </div>
                                    </div>
                                )}
                                {data?.tag_details.parent_phone_number && (
                                    <div className="flex flex-row justify-between border-b-2 border-[#CAB7B7] pt-1">
                                        <div className="text-[#CAB7B7] pr-2">
                                            Phone Number
                                        </div>
                                        <div className="text-right pl-2" style={{ wordBreak: 'break-word' }}>
                                            <a className="hover:bg-lightest-purple hover:text-purple" href={`tel:${data?.tag_details.parent_phone_number}`}>
                                                {data?.tag_details.parent_phone_number}
                                            </a>
                                        </div>
                                    </div>
                                )}
                                {data?.tag_details
                                    .parent_phone_number_additional_1 && (
                                    <div className="flex flex-row justify-between border-b-2 border-[#CAB7B7] pt-1">
                                        <div className="text-[#CAB7B7] pr-2">
                                            Additional Phone Number
                                        </div>
                                        <div className="text-right pl-2" style={{ wordBreak: 'break-word' }}>
                                        <a className="hover:bg-lightest-purple hover:text-purple" href={`tel:${data?.tag_details.parent_phone_number_additional_1}`}>
                                            {data?.tag_details.parent_phone_number_additional_1}</a>
                                        </div>
                                    </div>
                                )}
                                {data?.tag_details
                                    .parent_phone_number_additional_2 && (
                                    <div className="flex flex-row justify-between border-b-2 border-[#CAB7B7] pt-1">
                                        <div className="text-[#CAB7B7] pr-2">
                                            Additional Phone Number
                                        </div>
                                        <div className="text-right pl-2" style={{ wordBreak: 'break-word' }}>
                                            <a className="hover:bg-lightest-purple hover:text-purple" href={`tel:${data?.tag_details.parent_phone_number_additional_2}`}>
                                                {data?.tag_details.parent_phone_number_additional_2}
                                            </a>
                                        </div>
                                    </div>
                                )}
                                {data?.tag_details.parent_email && (
                                    <div className="flex flex-row justify-between border-b-2 border-[#CAB7B7] pt-1">
                                        <div className="text-[#CAB7B7] pr-2">
                                            Email
                                        </div>
                                        <div className="text-right pl-2" style={{ wordBreak: 'break-word' }}>
                                            <a className="hover:bg-lightest-purple hover:text-purple" href={`mailto:${data?.tag_details.parent_email}`}>
                                                {data?.tag_details.parent_email}
                                            </a>
                                        </div>
                                    </div>
                                )}
                                {data?.tag_details.parent_email_additional && (
                                    <div className="flex flex-row justify-between border-b-2 border-[#CAB7B7] pt-1">
                                        <div className="text-[#CAB7B7] pr-2">
                                            Additional Email
                                        </div>
                                        <div className="text-right pl-2">
                                            <a className="hover:bg-lightest-purple hover:text-purple" href={`mailto:${data?.tag_details.parent_email_additional}`}>
                                                {data?.tag_details.parent_email_additional}
                                            </a>
                                        </div>
                                    </div>
                                )}
                                {data?.tag_details.parent_street_address && (
                                    <div className="flex flex-row justify-between border-b-2 border-[#CAB7B7] pt-1">
                                        <div className="text-[#CAB7B7] pr-2">
                                            Street Address
                                        </div>
                                        <div className="text-right pl-2" style={{ wordBreak: 'break-word' }}>
                                            {
                                                data?.tag_details
                                                    .parent_street_address
                                            }
                                        </div>
                                    </div>
                                )}
                                {data?.tag_details.parent_apt_suite_unit && (
                                    <div className="flex flex-row justify-between border-b-2 border-[#CAB7B7] pt-1">
                                        <div className="text-[#CAB7B7] pr-2">
                                            Apt, Suite, etc.
                                        </div>
                                        <div className="text-right pl-2" style={{ wordBreak: 'break-word' }}>
                                            {
                                                data?.tag_details
                                                    .parent_apt_suite_unit
                                            }
                                        </div>
                                    </div>
                                )}
                                {data?.tag_details.parent_city && (
                                    <div className="flex flex-row justify-between border-b-2 border-[#CAB7B7] pt-1">
                                        <div className="text-[#CAB7B7] pr-2">
                                            City
                                        </div>
                                        <div className="text-right pl-2" style={{ wordBreak: 'break-word' }}>
                                            {data?.tag_details.parent_city}
                                        </div>
                                    </div>
                                )}
                                {data?.tag_details.parent_state && (
                                    <div className="flex flex-row justify-between border-b-2 border-[#CAB7B7] pt-1">
                                        <div className="text-[#CAB7B7] pr-2">
                                            State
                                        </div>
                                        <div className="text-right pl-2" style={{ wordBreak: 'break-word' }}>
                                            {data?.tag_details.parent_state}
                                        </div>
                                    </div>
                                )}
                                {data?.tag_details.parent_zipcode && (
                                    <div className="flex flex-row justify-between border-b-2 border-[#CAB7B7] pt-1">
                                        <div className="text-[#CAB7B7] pr-2">
                                            Zip Code
                                        </div>
                                        <div className="text-right pl-2" style={{ wordBreak: 'break-word' }}>
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
