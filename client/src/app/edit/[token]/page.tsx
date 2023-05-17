"use client";
import { useEffect, useState } from "react";
import {
    OwnerDetailsType,
    OwnerType,
    TagDetailsType,
    TagType,
} from "../../../models/types";
import { RedirectToSignIn, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { LoadingSpinner } from "@/src/components/LoadingSpinner.component";
import { Navbar } from "@/src/components/NavBar.component";
import { FileUploader } from "react-drag-drop-files";
import { useRouter } from "next/navigation";
import { s3Client } from "@/lib/s3bucket";
import { v4 } from "uuid";

export default function EditTagPage({ params }: { params: { token: string } }) {
    const [tag, setTag] = useState<TagType>();
    const [tagDetails, setTagDetails] = useState<TagDetailsType>();

    const [checkedIfOwner, setCheckedIfOwner] = useState(false);

    const [loadingData, setLoadingData] = useState(false);
    const [ownerDetails, setOwnerDetails] = useState<OwnerDetailsType>();

    const [creatingTag, setCreatingTag] = useState<boolean>(false);

    const [showParentFields, setShowParentFields] = useState<boolean>(false);
    const [showAdditionalFields, setShowAdditionalFields] =
        useState<boolean>(false);

    const [petPhotoFile, setPetPhotoFile] = useState<File>();
    const [isUploading, setIsUploading] = useState<boolean>(false);

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

    const fileTypes = ["JPG", "PNG", "GIF", "HEIC", "HEIF", "JPEG"];

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

        const getOwnedTags = async (uID: string) => {
            const request = await fetch(`/api/tags/owned?uID=${uID}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const response = await request.json();

            console.log(response);

            return response;
        };

        const doesUserOwnTag = async (uID: string, token: string) => {
            const request = await fetch(
                `/api/isOwnerOfTag?uID=${uID}&token=${token}`,
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

        const setInitialValues = (tag_details: TagDetailsType) => {
            console.log(tagDetails);
            console.log(tag_details?.name);

            setName(tag_details?.name as string);
            setPhotoUrl(tag_details?.photo_url as string);
            setBio(tag_details?.bio as string);
            setBirthday(tag_details?.birthday as string);
            setBreed(tag_details?.breed as string);
            setGender(tag_details?.gender as string);
            setMicrochipNumber(tag_details?.microchip_number as string);
            setSpayedOrNeutered(tag_details?.neutered_spayed as boolean);
            setBehaviour(tag_details?.behaviour as string);
            setAllergies(tag_details?.allergies as string);
            setUseOwnerDetails(tag_details?.uses_owners_information as boolean);
            setParentName(tag_details?.parent_name as string);
            setParentPhoneNumber(tag_details?.parent_phone_number as string);
            setParentPhoneNumberAdditional1(
                tag_details?.parent_phone_number_additional_1 as string
            );
            setParentPhoneNumberAdditional2(
                tag_details?.parent_phone_number_additional_2 as string
            );
            setParentEmail(tag_details?.parent_email as string);
            setParentEmailAdditional(
                tag_details?.parent_email_additional as string
            );
            setParentStreetAddress(
                tag_details?.parent_street_address as string
            );
            setParentApartmentSuite(
                tag_details?.parent_apt_suite_unit as string
            );
            setParentCity(tag_details?.parent_city as string);
            setParentState(tag_details?.parent_state as string);
            setParentZipcode(tag_details?.parent_zipcode as string);
        };

        if (!checkedIfOwner && user.isSignedIn) {
            doesUserOwnTag(user.user.id, params.token).then((data) => {
                if (data.status == 200) {
                    if (data.body.owns_tag == false) {
                        router.push("/notOwner");
                    }
                }
            });
        }

        if (!tag) {
            getTagData(params.token).then((data) => {
                if (data.status === 200) {
                    setTag(data.body.tag);
                    setLoadingData(true);
                } else {
                    return;
                }
            });

            getViewData(params.token).then((data) => {
                if (data.status === 200) {
                    setTagDetails(data.body.tag_details);
                    setInitialValues(data.body.tag_details);
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
    }, [checkedIfOwner, loadingData, params, router, tag, tagDetails, user]);

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

        setIsUploading(true);

        // Upload new photo to S3
        const uploadParams = {
            Bucket: "ar-t-cacher-app-s3",
            Key: `PawFurEver/tag/${tag?.TAG_TOKEN}/${v4()}/${file.name}`,
            ACL: "public-read",
            Body: file as File,
        };

        // Send the upload to S3
        s3Client.upload(uploadParams, {}, async (err, data) => {
            if (err) {
                console.log(err.message);

                const uploadError = await fetch("/api/notifyError", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        message: err.message,
                    }),
                });

                console.log(uploadError.json());

                console.log(err);

                setIsUploading(false);
            }

            // HOTFIX - S3 returns a location without https://
            var trueLocation = "";
            if (data.Location.includes("https://")) {
                trueLocation = data.Location;
            } else {
                trueLocation = `https://${data.Location}`;
            }

            console.log(`Photo uploaded successfully: ${trueLocation}`);

            const uploadResult = await fetch("/api/notifyError", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: `Photo uploaded successfully: ${trueLocation}`,
                }),
            });

            console.log(uploadResult.json());

            setPhotoUrl(trueLocation);
            setIsUploading(false);
        });
    };

    const verifyForm = (e: any) => {
        e.preventDefault();

        if (name == "") {
            setErrors(["Pet name is empty"]);
            return;
        }

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
            if (parentEmail != "" && !parentEmail?.includes("@")) {
                console.log(parentEmail);
                setErrors(["Parent's email is invalid"]);
                return;
            }

            if (parentPhoneNumber == "") {
                setErrors(["Phone number is empty"]);
                return;
            }
        }

        console.log(errors);

        setCreatingTag(true);

        submitForm();
    };

    const submitForm = async () => {
        const tagDetails = {
            name: name,
            photo_url: photoUrl,
            bio: bio,
            birthday: birthday ? new Date(birthday).toISOString() : null,
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

    const convertDate = (date: string) => {
        const temp_date: Date = new Date(date);
        const year = temp_date.getFullYear();
        const month = temp_date.getMonth() + 1;
        const days = temp_date.getDate();

        return `${year}-${month}-${days}`;
    };

    if (!tag) {
        return <LoadingSpinner display_text="Loading Tag Details..." />;
    }

    if (loadingData && !ownerDetails) {
        return <LoadingSpinner display_text="Loading Owner Details..." />;
    }

    if (creatingTag) {
        return <LoadingSpinner display_text="Saving Tag..." />;
    }

    if (user.isLoaded && !user.isSignedIn) {
        return <RedirectToSignIn />;
    }

    return (
        <>
            <Navbar />
            <div className="flex items-center justify-center overflow-auto">
                <div className="flex flex-col">
                    {/* <h1 className="top-0 text-headingCustom underline text-black text-center mb-[25px]">
                    Add Tag Details
                </h1> */}
                    <div className="flex-0 top-[96px] mb-[25px] mt-[25px] w-full text-center">
                        <h1 className="text-black-400 text-4xl">
                            Edit Tag Details
                        </h1>
                    </div>

                    <input
                        type="text"
                        className="border-1 border-black-[rgba(0,0,0,0.5)] text-[rgba(0,0,0,0.75)]-400 mb-[25px] w-[calc(100vw-72px)] rounded-[5px] bg-cream text-base"
                        placeholder="Pet's Name"
                        onChange={(e) => setName(e.target.value)}
                        required={true}
                        defaultValue={
                            tagDetails?.name ? (tagDetails.name as string) : ""
                        }
                    />
                    <div className="mb-[25px] w-[calc(100vw-72px)]">
                        <span className="text-left">
                            Upload a photo of your pet (optional)
                        </span>
                        <div className="flex flex-row">
                            <FileUploader
                                className="border-1 border-black-400 text-[rgba(0,0,0,0.75)]-400 max-width mb-[25px] bg-cream text-base shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)]"
                                name="file"
                                handleChange={(file: any) => uploadPhoto(file)}
                                types={fileTypes}
                                onSizeError={(e: any) => errors.push(e)}
                                maxSize={60}
                                onTypeError={(e: any) => errors.push(e)}
                            />
                            {isUploading ? (
                                <svg
                                    aria-hidden="true"
                                    className="mr-2 h-8 w-8 animate-spin fill-light-purple text-cream dark:text-black"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"
                                    />
                                </svg>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>

                    <textarea
                        className="border-1  border-black-[rgba(0,0,0,0.5)] text-[rgba(0,0,0,0.75)]-400 mb-[25px]  w-[calc(100vw-72px)]  rounded-[5px] bg-cream text-base"
                        placeholder="Pet Bio (optional)"
                        onChange={(e) => setBio(e.target.value)}
                        defaultValue={
                            tagDetails?.bio ? (tagDetails.bio as string) : ""
                        }
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
                                    defaultValue={
                                        tagDetails?.birthday
                                            ? convertDate(
                                                  tagDetails.birthday as string
                                              )
                                            : undefined
                                    }
                                />
                                {birthday}
                            </div>

                            <input
                                type="text"
                                className="border-1 border-black-[rgba(0,0,0,0.5)] text-[rgba(0,0,0,0.75)]-400 mb-[25px] w-[calc(100vw-72px)] rounded-[5px] bg-cream text-base"
                                placeholder="Pet's Breed (optional)"
                                onChange={(e) => setBreed(e.target.value)}
                                defaultValue={
                                    tagDetails?.breed
                                        ? (tagDetails.breed as string)
                                        : ""
                                }
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
                                    {tagDetails?.gender == null ? (
                                        <>
                                            <option value="" selected>
                                                Select (optional)
                                            </option>
                                            <option value="Male">Male</option>
                                            <option value="Female">
                                                Female
                                            </option>
                                        </>
                                    ) : (
                                        <>
                                            {tagDetails?.gender == "Male" ? (
                                                <>
                                                    <option value="">
                                                        Select (optional)
                                                    </option>
                                                    <option
                                                        value="Male"
                                                        selected
                                                    >
                                                        Male
                                                    </option>
                                                    <option value="Female">
                                                        Female
                                                    </option>
                                                </>
                                            ) : (
                                                <>
                                                    <option value="">
                                                        Select (optional)
                                                    </option>
                                                    <option value="Male">
                                                        Male
                                                    </option>
                                                    <option
                                                        value="Female"
                                                        selected
                                                    >
                                                        Female
                                                    </option>
                                                </>
                                            )}
                                        </>
                                    )}
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
                                defaultValue={
                                    tagDetails?.microchip_number
                                        ? (tagDetails.microchip_number as string)
                                        : ""
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
                                    {tagDetails?.neutered_spayed == null ? (
                                        <>
                                            <option value="" selected>
                                                Select (optional)
                                            </option>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                        </>
                                    ) : (
                                        <>
                                            {tagDetails?.neutered_spayed ? (
                                                <>
                                                    <option value="">
                                                        Select (optional)
                                                    </option>
                                                    <option
                                                        value="yes"
                                                        selected
                                                    >
                                                        Yes
                                                    </option>
                                                    <option value="no">
                                                        No
                                                    </option>
                                                </>
                                            ) : (
                                                <>
                                                    <option value="">
                                                        Select (optional)
                                                    </option>
                                                    <option value="yes">
                                                        Yes
                                                    </option>
                                                    <option value="no" selected>
                                                        No
                                                    </option>
                                                </>
                                            )}
                                        </>
                                    )}
                                </select>
                            </div>

                            {/* Pet Behaviour */}
                            <textarea
                                className="border-1  border-black-[rgba(0,0,0,0.5)] text-[rgba(0,0,0,0.75)]-400 mb-[25px]  w-[calc(100vw-72px)]  rounded-[5px] bg-cream text-base"
                                placeholder="Pet Behaviour (optional)"
                                onChange={(e) => setBehaviour(e.target.value)}
                                required={false}
                                defaultValue={
                                    tagDetails?.behaviour
                                        ? (tagDetails.behaviour as string)
                                        : ""
                                }
                                maxLength={100}
                            />

                            {/* Pet Allergies */}
                            <textarea
                                className="border-1  border-black-[rgba(0,0,0,0.5)] text-[rgba(0,0,0,0.75)]-400 mb-[25px]  w-[calc(100vw-72px)]  rounded-[5px] bg-cream text-base"
                                placeholder="Pet Allergies (optional)"
                                onChange={(e) => setAllergies(e.target.value)}
                                required={false}
                                defaultValue={
                                    tagDetails?.allergies
                                        ? (tagDetails.allergies as string)
                                        : ""
                                }
                                maxLength={100}
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
                                    defaultChecked={
                                        tagDetails?.uses_owners_information
                                            ? true
                                            : false
                                    }
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
                                defaultValue={
                                    tagDetails?.parent_name
                                        ? (tagDetails.parent_name as string)
                                        : ""
                                }
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
                                defaultValue={
                                    tagDetails?.parent_phone_number
                                        ? (tagDetails.parent_phone_number as string)
                                        : ""
                                }
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
                                defaultValue={
                                    tagDetails?.parent_phone_number_additional_1
                                        ? (tagDetails.parent_phone_number_additional_1 as string)
                                        : ""
                                }
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
                                defaultValue={
                                    tagDetails?.parent_phone_number_additional_2
                                        ? (tagDetails.parent_phone_number_additional_2 as string)
                                        : ""
                                }
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
                                defaultValue={
                                    tagDetails?.parent_email
                                        ? (tagDetails.parent_email as string)
                                        : ""
                                }
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
                                defaultValue={
                                    tagDetails?.parent_email_additional
                                        ? (tagDetails.parent_email_additional as string)
                                        : ""
                                }
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
                                defaultValue={
                                    tagDetails?.parent_street_address
                                        ? (tagDetails.parent_street_address as string)
                                        : ""
                                }
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
                                defaultValue={
                                    tagDetails?.parent_apt_suite_unit
                                        ? (tagDetails.parent_apt_suite_unit as string)
                                        : ""
                                }
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
                                defaultValue={
                                    tagDetails?.parent_city
                                        ? (tagDetails.parent_city as string)
                                        : ""
                                }
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
                                defaultValue={
                                    tagDetails?.parent_state
                                        ? (tagDetails.parent_state as string)
                                        : ""
                                }
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
                                defaultValue={
                                    tagDetails?.parent_zipcode
                                        ? (tagDetails.parent_zipcode as string)
                                        : ""
                                }
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
                        disabled={isUploading}
                    >
                        SAVE TAG
                    </button>
                </div>
            </div>
        </>
    );
}
