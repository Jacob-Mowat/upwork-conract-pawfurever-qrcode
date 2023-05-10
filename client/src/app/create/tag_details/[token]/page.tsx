"use client";

import { LoadingSpinner } from "@/src/components/LoadingSpinner.component";
import { useEffect, useState } from "react";
import { OwnerDetailsType, TagType } from "../../../../models/types";
import { Navbar } from "@/src/components/NavBar.component";
// import TagAddDetailsView from "@/src/components/tags/TagAddDetailsView.component";
import { RedirectToSignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { s3Client } from "@/lib/s3bucket";
import { FileUploader } from "react-drag-drop-files";
import { BsFillCaretLeftSquareFill } from "react-icons/bs";

export default function CreateTagDetailsPage({
    params,
}: {
    params: { token: string };
}) {
    const [tag, setTag] = useState<TagType>();

    const [loadingData, setLoadingData] = useState(false);
    const [ownerDetails, setOwnerDetails] = useState<OwnerDetailsType>();

    const [creatingTag, setCreatingTag] = useState<boolean>(false);

    const [showParentFields, setShowParentFields] = useState<boolean>(true);
    const [showAdditionalFields, setShowAdditionalFields] =
        useState<boolean>(false);

    const [petPhotoFile, setPetPhotoFile] = useState<File>();

    // Pet Information
    const [name, setName] = useState<string>();
    const [photoUrl, setPhotoUrl] = useState<string>();
    const [bio, setBio] = useState<string>();
    const [birthday, setBirthday] = useState<string>();
    const [breed, setBreed] = useState<string>();
    const [gender, setGender] = useState<string>();
    const [microchipNumber, setMicrochipNumber] = useState<string>();
    const [spayedOrNeutered, setSpayedOrNeutered] = useState<boolean>();
    const [behaviour, setBehaviour] = useState<string>();
    const [allergies, setAllergies] = useState<string>();

    // Parent Information
    const [useOwnerDetails, setUseOwnerDetails] = useState<boolean>(false);
    const [parentName, setParentName] = useState<string>();
    const [parentPhoneNumber, setParentPhoneNumber] = useState<string>();
    const [parentPhoneNumberAdditional1, setParentPhoneNumberAdditional1] =
        useState<string>();
    const [parentPhoneNumberAdditional2, setParentPhoneNumberAdditional2] =
        useState<string>();
    const [parentEmail, setParentEmail] = useState<string>();
    const [parentEmailAdditional, setParentEmailAdditional] =
        useState<string>();
    const [parentStreetAddress, setParentStreetAddress] = useState<string>();
    const [parentApartmentSuite, setParentApartmentSuite] = useState<string>();
    const [parentCity, setParentCity] = useState<string>();
    const [parentState, setParentState] = useState<string>();
    const [parentZipcode, setParentZipcode] = useState<string>();

    const [errors, setErrors] = useState<string[]>([]);

    const user = useUser();
    const router = useRouter();

    const fileTypes = ["JPG", "PNG", "GIF"];

    useEffect(() => {
        const getTagData = async (token: string) => {
            const request = await fetch(`/api/tags?token=${token}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const response = await request.json();

            console.log(response);

            return response;
        };

        if (!tag) {
            getTagData(params.token).then((data) => {
                if (data.status === 200) {
                    setTag(data.body.tag);
                    setLoadingData(true);
                } else {
                    return;
                }
            });
        } else {
            if (loadingData) {
                if (!tag.owner_id) {
                    return;
                }

                console.log(tag.owner_id as string);

                getOwnerDetails(tag.owner_id as string).then((data) => {
                    setLoadingData(false);
                    setOwnerDetails(data.body.ownerDetails);
                    console.log(data.body.ownerDetails);
                });
            }
        }
    }, [loadingData, params, tag]);

    const getOwnerDetails = async (oID: string) => {
        const request = await fetch(`/api/owner-details/?ownerID=${oID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const response = await request.json();

        return response;
    };

    const uploadPhoto = async (file: File) => {
        console.log(file);

        // Upload to S3
        const uploadParams = {
            Bucket: "ar-t-cacher-app-s3",
            Key: `PawFurEver/tag/${tag?.TAG_TOKEN}/${file.name}{f}`,
            ACL: "public-read",
            Body: file as File,
        };

        // Send the upload to S3
        const response = await s3Client.upload(uploadParams).promise();

        setPhotoUrl(response.Location);
        console.log(response.Location);

        return;
    };

    const verifyForm = (e: any) => {
        e.preventDefault();

        if (name == "") {
            setErrors(["Pet name is empty"]);
            return;
        }

        // if (petPhotoFile == null) {
        //     setErrors(["Pet photo is empty"]);
        //     return;
        // }

        if (!useOwnerDetails) {
            if (parentName == "") {
                setErrors(["Parent's name is empty"]);
                return;
            }

            if (parentEmail == "") {
                setErrors(["Parent's email is empty"]);
                return;
            }

            // check email is valid using regex
            const emailRegex = /\S+@\S+\.\S+/;
            if (parentEmail != "" && !emailRegex.test(parentEmail as string)) {
                setErrors(["Parent's email is invalid"]);
                return;
            }

            if (parentPhoneNumber == "") {
                setErrors(["Phone number is empty"]);
                return;
            }
        }

        setCreatingTag(true);

        submitForm();
    };

    const submitForm = async () => {
        const tagDetails = {
            name: name,
            photo_url: photoUrl,
            bio: bio,
            birthday: birthday,
            breed: breed,
            gender: gender,
            microchip_number: microchipNumber,
            neutered_spayed: spayedOrNeutered,
            behaviour: behaviour,
            allergies: allergies,
            uses_owners_information: useOwnerDetails,
            parent_name: parentName,
            parent_phone_number: parentPhoneNumber,
            parent_phone_number_additional_1: parentPhoneNumberAdditional1,
            parent_phone_number_additional_2: parentPhoneNumberAdditional2,
            parent_email: parentEmail,
            parent_email_additional: parentEmailAdditional,
            parent_street_address: parentStreetAddress,
            parent_apt_suite_unit: parentApartmentSuite,
            parent_city: parentCity,
            parent_state: parentState,
            parent_zipcode: parentZipcode,
            tagID: tag?.id,
        };

        console.log(tagDetails);

        const response = await fetch("/api/tags/edit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(tagDetails),
        });

        if (response.status == 200) {
            console.log("Tag details added successfully");
            console.log(response);
            router.push(`/view/${tag?.TAG_TOKEN}`);
        } else {
            setErrors(["Something went wrong"]);
        }
    };

    const handleUseOwnerDetails = (e: any) => {
        setUseOwnerDetails(e.target.checked);

        if (e.target.checked && ownerDetails != null) {
            setParentName(ownerDetails.name as string);
            setParentPhoneNumber(ownerDetails.phone_number as string);
            setParentPhoneNumberAdditional1(
                ownerDetails.phone_number_additional_1 as string
            );
            setParentPhoneNumberAdditional2(
                ownerDetails.phone_number_additional_2 as string
            );
            setParentEmail(ownerDetails.email as string);
            setParentEmailAdditional(ownerDetails.email_additional as string);
            setParentStreetAddress(ownerDetails.street_address as string);
            setParentApartmentSuite(ownerDetails.apt_suite_unit as string);
            setParentCity(ownerDetails.city as string);
            setParentState(ownerDetails.state as string);
            setParentZipcode(ownerDetails.zipcode as string);
        }
    };

    if (!user) {
        return <RedirectToSignIn />;
    }

    if (!tag) {
        return <LoadingSpinner display_text="Loading Tag Details..." />;
    }

    if (loadingData && !ownerDetails) {
        return <LoadingSpinner display_text="Loading Owner Details..." />;
    }

    if (creatingTag) {
        return <LoadingSpinner display_text="Creating Tag..." />;
    }

    return (
        <>
            <div className="flex items-center justify-center overflow-auto">
                <div className="flex flex-col">
                    {/* <h1 className="top-0 text-headingCustom underline text-black text-center mb-[25px]">
                        Add Tag Details
                    </h1> */}
                    <div className="flex-0 top-[96px] mb-[25px] mt-[25px] w-full text-center">
                        <h1 className="text-black-400 text-4xl">
                            Add Tag Details
                        </h1>
                    </div>

                    <input
                        type="text"
                        className="border-1 border-black-[rgba(0,0,0,0.5)] text-[rgba(0,0,0,0.75)]-400 mb-[25px] w-[calc(100vw-72px)] rounded-[5px] bg-cream text-base"
                        placeholder="Pet's Name"
                        onChange={(e) => setName(e.target.value)}
                        required={true}
                    />
                    <div className="mb-[25px] w-[calc(100vw-72px)]">
                        <span className="text-left">
                            Upload a photo of your pet (optional)
                        </span>
                        <FileUploader
                            className="border-1 border-black-400 text-[rgba(0,0,0,0.75)]-400 max-width mb-[25px] bg-cream text-base shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)]"
                            name="file"
                            handleChange={(file: any) => uploadPhoto(file)}
                            types={fileTypes}
                            onSizeError={(e: any) => errors.push(e)}
                            maxSize={60}
                            onTypeError={(e: any) => errors.push(e)}
                        />
                    </div>

                    <textarea
                        className="border-1  border-black-[rgba(0,0,0,0.5)] text-[rgba(0,0,0,0.75)]-400 mb-[25px]  w-[calc(100vw-72px)]  rounded-[5px] bg-cream text-base"
                        placeholder="Pet Bio (optional)"
                        onChange={(e) => setBio(e.target.value)}
                    />

                    {/* Toggle Additional Information fields */}
                    <div
                        className="flex w-full flex-row "
                        onClick={(e) =>
                            setShowAdditionalFields(!showAdditionalFields)
                        }
                    >
                        <div className="mb-[25px] grow text-left">
                            {showAdditionalFields
                                ? "Hide Additional Information"
                                : "Show Additional Information"}
                        </div>
                        <div className="flex-none">
                            {!showAdditionalFields ? (
                                <svg
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                    height="1em"
                                    width="1em"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M7.646 4.646a.5.5 0 01.708 0l6 6a.5.5 0 01-.708.708L8 5.707l-5.646 5.647a.5.5 0 01-.708-.708l6-6z"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                    height="1em"
                                    width="1em"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M1.646 4.646a.5.5 0 01.708 0L8 10.293l5.646-5.647a.5.5 0 01.708.708l-6 6a.5.5 0 01-.708 0l-6-6a.5.5 0 010-.708z"
                                    />
                                </svg>
                            )}
                        </div>
                    </div>

                    {showAdditionalFields ? (
                        <>
                            <div className="flex flex-col">
                                <div className="mb-[5px] rounded-[50%] bg-cream">
                                    Pets birthday (optional)
                                </div>
                                <input
                                    type="date"
                                    className="border-1 border-black-[rgba(0,0,0,0.5)] text-[rgba(0,0,0,0.75)]-400 mb-[25px] w-[calc(100vw-72px)]  rounded-[5px] bg-cream text-base"
                                    placeholder="Date of Birth (optional)"
                                    onChange={(e) =>
                                        setBirthday(e.target.value)
                                    }
                                />
                            </div>

                            <input
                                type="text"
                                className="border-1 border-black-[rgba(0,0,0,0.5)] text-[rgba(0,0,0,0.75)]-400 mb-[25px] w-[calc(100vw-72px)] rounded-[5px] bg-cream text-base"
                                placeholder="Pet's Breed (optional)"
                                onChange={(e) => setBreed(e.target.value)}
                            />

                            <div className="flex flex-col">
                                <div className="mb-[5px] rounded-[50%] bg-cream">
                                    Gender
                                </div>
                                <select
                                    className="border-1 border-black-[rgba(0,0,0,0.5)] text-[rgba(0,0,0,0.75)]-400 mb-[25px] w-[calc(100vw-72px)] rounded-[5px] bg-cream text-base"
                                    onChange={(e) => setGender(e.target.value)}
                                    required={false}
                                >
                                    <option value="" selected>
                                        Select (optional)
                                    </option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>

                            {/* Pet Microchip number */}
                            <input
                                type="text"
                                className="border-1 border-black-[rgba(0,0,0,0.5)] text-[rgba(0,0,0,0.75)]-400 mb-[25px] w-[calc(100vw-72px)] rounded-[5px] bg-cream text-base"
                                placeholder="Pet's Microchip Number (optional)"
                                onChange={(e) =>
                                    setMicrochipNumber(e.target.value)
                                }
                            />

                            {/* Pet is Spayed or Neutered? */}
                            <div className="flex flex-col">
                                <div className="mb-[5px] rounded-[50%] bg-cream">
                                    Is your pet spayed or neutered?
                                </div>
                                <select
                                    className="border-1 border-black-[rgba(0,0,0,0.5)] text-[rgba(0,0,0,0.75)]-400 mb-[25px] w-[calc(100vw-72px)] rounded-[5px] bg-cream text-base"
                                    onChange={(e) =>
                                        setSpayedOrNeutered(
                                            e.target.value === "yes"
                                                ? true
                                                : false
                                        )
                                    }
                                    required={false}
                                >
                                    <option value="" selected>
                                        Select (optional)
                                    </option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </div>

                            {/* Pet Behaviour */}
                            <textarea
                                className="border-1  border-black-[rgba(0,0,0,0.5)] text-[rgba(0,0,0,0.75)]-400 mb-[25px]  w-[calc(100vw-72px)]  rounded-[5px] bg-cream text-base"
                                placeholder="Pet Behaviour (optional)"
                                onChange={(e) => setBehaviour(e.target.value)}
                                required={false}
                            />

                            {/* Pet Allergies */}
                            <textarea
                                className="border-1  border-black-[rgba(0,0,0,0.5)] text-[rgba(0,0,0,0.75)]-400 mb-[25px]  w-[calc(100vw-72px)]  rounded-[5px] bg-cream text-base"
                                placeholder="Pet Allergies (optional)"
                                onChange={(e) => setAllergies(e.target.value)}
                                required={false}
                            />
                        </>
                    ) : (
                        <></>
                    )}

                    {/* Toggle Parent Information fields */}
                    <div
                        className="flex w-full flex-row "
                        onClick={(e) => setShowParentFields(!showParentFields)}
                    >
                        <div className="mb-[25px] grow text-left">
                            {showParentFields
                                ? "Hide Parent Information"
                                : "Show Parent Information"}
                        </div>
                        <div className="flex-none">
                            {!showParentFields ? (
                                <svg
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                    height="1em"
                                    width="1em"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M7.646 4.646a.5.5 0 01.708 0l6 6a.5.5 0 01-.708.708L8 5.707l-5.646 5.647a.5.5 0 01-.708-.708l6-6z"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                    height="1em"
                                    width="1em"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M1.646 4.646a.5.5 0 01.708 0L8 10.293l5.646-5.647a.5.5 0 01.708.708l-6 6a.5.5 0 01-.708 0l-6-6a.5.5 0 010-.708z"
                                    />
                                </svg>
                            )}
                        </div>
                    </div>

                    {showParentFields ? (
                        <>
                            <div className="mb-[25px] text-left">
                                <input
                                    type="checkbox"
                                    className="mb-[5px] rounded-[50%] bg-cream"
                                    name="use_owner_information"
                                    defaultChecked={useOwnerDetails}
                                    onChange={(e) => handleUseOwnerDetails(e)}
                                    required={true}
                                />
                                {/* eslint-disable-next-line react/no-unescaped-entities */}
                                <span> Use my information as the Parent?</span>
                            </div>

                            <input
                                type="text"
                                className="border-1 border-black-[rgba(0,0,0,0.5)] text-[rgba(0,0,0,0.75)]-400 mb-[25px]  w-[calc(100vw-72px)]  rounded-[5px] bg-cream text-base"
                                placeholder={
                                    useOwnerDetails
                                        ? (ownerDetails?.name as string)
                                        : "Parent's Name"
                                }
                                onChange={(e) => setParentName(e.target.value)}
                                disabled={useOwnerDetails}
                                required={!useOwnerDetails}
                            />
                            <input
                                type="text"
                                className="border-1  border-black-[rgba(0,0,0,0.5)] text-[rgba(0,0,0,0.75)]-400 mb-[25px]  w-[calc(100vw-72px)]  rounded-[5px] bg-cream text-base"
                                placeholder={
                                    useOwnerDetails
                                        ? (ownerDetails?.phone_number as string)
                                        : "Parent's Phone Number"
                                }
                                onChange={(e) =>
                                    setParentPhoneNumber(e.target.value)
                                }
                                disabled={useOwnerDetails}
                                required={!useOwnerDetails}
                            />
                            <input
                                type="text"
                                className="border-1 border-black-[rgba(0,0,0,0.5)] text-[rgba(0,0,0,0.75)]-400 mb-[25px] w-[calc(100vw-72px)] rounded-[5px] bg-cream text-base"
                                placeholder={
                                    useOwnerDetails
                                        ? (ownerDetails?.phone_number_additional_1 as string)
                                        : "Parent's Additional Phone Number (optional)"
                                }
                                onChange={(e) =>
                                    setParentPhoneNumberAdditional1(
                                        e.target.value
                                    )
                                }
                                required={false}
                            />
                            <input
                                type="text"
                                className="border-1 border-black-[rgba(0,0,0,0.5)] text-[rgba(0,0,0,0.75)]-400 mb-[25px] w-[calc(100vw-72px)] rounded-[5px] bg-cream text-base"
                                placeholder={
                                    useOwnerDetails
                                        ? (ownerDetails?.phone_number_additional_2 as string)
                                        : "Parent's Second Additional Phone Number (optional)"
                                }
                                onChange={(e) =>
                                    setParentPhoneNumberAdditional2(
                                        e.target.value
                                    )
                                }
                                required={false}
                            />
                            <input
                                type="text"
                                className="border-1 border-black-[rgba(0,0,0,0.5)] text-[rgba(0,0,0,0.75)]-400 mb-[25px] w-[calc(100vw-72px)] rounded-[5px] bg-cream text-base"
                                placeholder={
                                    useOwnerDetails
                                        ? (ownerDetails?.email as string)
                                        : "Parent's Email"
                                }
                                onChange={(e) => setParentEmail(e.target.value)}
                                required={true}
                            />
                            <input
                                type="text"
                                className="border-1 border-black-[rgba(0,0,0,0.5)] text-[rgba(0,0,0,0.75)]-400 mb-[25px] w-[calc(100vw-72px)] rounded-[5px] bg-cream text-base"
                                placeholder={
                                    useOwnerDetails
                                        ? (ownerDetails?.email_additional as string)
                                        : "Parent's Additional Email (optional)"
                                }
                                onChange={(e) =>
                                    setParentEmailAdditional(e.target.value)
                                }
                                required={false}
                            />

                            <input
                                type="text"
                                className="border-1 border-black-[rgba(0,0,0,0.5)] text-[rgba(0,0,0,0.75)]-400 mb-[25px] w-[calc(100vw-72px)] rounded-[5px] bg-cream text-base"
                                placeholder={
                                    useOwnerDetails
                                        ? (ownerDetails?.street_address as string)
                                        : "Parent's Street Address (optional)"
                                }
                                onChange={(e) =>
                                    setParentStreetAddress(e.target.value)
                                }
                                required={false}
                            />
                            <input
                                type="text"
                                className="border-1 border-black-[rgba(0,0,0,0.5)] text-[rgba(0,0,0,0.75)]-400 mb-[25px] w-[calc(100vw-72px)] rounded-[5px] bg-cream text-base"
                                placeholder={
                                    useOwnerDetails
                                        ? (ownerDetails?.apt_suite_unit as string)
                                        : "Parent's Apartment, suite, etc. (optional)"
                                }
                                onChange={(e) =>
                                    setParentApartmentSuite(e.target.value)
                                }
                                required={false}
                            />
                            <input
                                type="text"
                                className="border-1 border-black-[rgba(0,0,0,0.5)] text-[rgba(0,0,0,0.75)]-400 mb-[25px] w-[calc(100vw-72px)] rounded-[5px] bg-cream text-base"
                                placeholder={
                                    useOwnerDetails
                                        ? (ownerDetails?.city as string)
                                        : "Parent's City (optional)"
                                }
                                onChange={(e) => setParentCity(e.target.value)}
                                required={false}
                            />
                            <input
                                type="text"
                                className="border-1 border-black-[rgba(0,0,0,0.5)] text-[rgba(0,0,0,0.75)]-400 mb-[25px] w-[calc(100vw-72px)] rounded-[5px] bg-cream text-base"
                                placeholder={
                                    useOwnerDetails
                                        ? (ownerDetails?.state as string)
                                        : "Parent's State (optional)"
                                }
                                onChange={(e) => setParentState(e.target.value)}
                                required={false}
                            />
                            <input
                                type="text"
                                className="border-1 border-black-[rgba(0,0,0,0.5)] text-[rgba(0,0,0,0.75)]-400 mb-[25px] w-[calc(100vw-72px)] rounded-[5px] bg-cream text-base"
                                placeholder={
                                    useOwnerDetails
                                        ? (ownerDetails?.zipcode as string)
                                        : "Parent's Zip Code (optional)"
                                }
                                onChange={(e) =>
                                    setParentZipcode(e.target.value)
                                }
                                required={false}
                            />
                        </>
                    ) : (
                        <></>
                    )}

                    {errors.map((error) => (
                        <div className="text-red-500" key={error}>
                            {error}
                        </div>
                    ))}

                    <button
                        className="bottom-[36px] mb-[25px] h-[48px] w-[100%] bg-dark-purple text-cream"
                        onClick={(e) => verifyForm(e)}
                    >
                        ADD TAG
                    </button>
                </div>
            </div>
        </>
    );
}
