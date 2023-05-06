import {
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton,
    useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";

interface NavbarProps {
    page?: string;
}

export const Navbar = ({ page }: NavbarProps) => {
    const [isHidden, setIsHidden] = useState<boolean>(true);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [createNewOwner, setCreateNewOwner] = useState<boolean>(false);

    const clerkAuth = useUser();

    useEffect(() => {
        if (clerkAuth.isSignedIn) {
            // Check if owner uID clerkAuth.user.id is a admin

            const checkIsAdmin = async () => {
                const request = await fetch(
                    `/api/owners/isAdmin?uID=${clerkAuth.user.id}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                const response = await request.json();

                // console.log(response);

                if (response.status === 200) {
                    // console.log("User is admin");
                    setIsAdmin(true);
                } else if (response.status === 404) {
                    // console.log("User doesn't exist");
                    setCreateNewOwner(true);
                } else if (response.status === 403) {
                    // console.log("User is not admin");
                    setIsAdmin(false);
                }
            };

            const createOwner = async () => {
                const request = await fetch(`/api/owners/create`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ user_id: clerkAuth.user.id }),
                });

                const response = await request.json();

                console.log(response);

                if (response.body.status == 200) {
                    console.log("Owner created");
                    setCreateNewOwner(false);
                } else {
                    console.log("Owner not created");
                }
            };

            if (createNewOwner) {
                createOwner();
            }

            checkIsAdmin();
        }
    }, [clerkAuth, createNewOwner]);

    return (
        <>
            <nav className="border-gray-200 bg-cream dark:bg-gray-800 dark:border-gray-700">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <button
                        data-collapse-toggle="navbar-hamburger"
                        type="button"
                        className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg hover:bg-lightest-purple focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="navbar-hamburger"
                        aria-expanded="false"
                        onClick={() => setIsHidden(!isHidden)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg
                            className="w-6 h-6"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                    </button>
                    <Link href="/">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="https://cdn.shopify.com/s/files/1/0584/8714/4505/files/paw-logo_200x.png?v=1647452909"
                            width="200"
                            height="64"
                            alt="PawFurEver"
                            className="align-middle"
                        />
                    </Link>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                    <SignedOut>
                        <SignInButton />
                    </SignedOut>
                    <div
                        className={isHidden ? "hidden w-full" : "w-full"}
                        id="navbar-hamburger"
                    >
                        <ul className="flex flex-col font-medium mt-4 rounded-lg bg-cream dark:bg-gray-800 dark:border-gray-700">
                            <li>
                                <a
                                    href="/"
                                    className={
                                        page === "home"
                                            ? "block py-2 pl-3 pr-4 text-black bg-lightest-purple rounded dark:bg-blue-600"
                                            : "block py-2 pl-3 pr-4 text-black rounded dark:bg-blue-600"
                                    }
                                >
                                    Home
                                </a>
                            </li>
                            <SignedIn>
                                <li>
                                    <a
                                        href="/owned-tag-list"
                                        className={
                                            page === "mytags"
                                                ? "block py-2 pl-3 pr-4 text-black bg-lightest-purple rounded dark:bg-blue-600"
                                                : "block py-2 pl-3 pr-4 text-black rounded dark:bg-blue-600"
                                        }
                                    >
                                        My Tags
                                    </a>
                                </li>
                                {isAdmin && (
                                    <>
                                        <li>
                                            <a
                                                href="/generate"
                                                className={
                                                    page === "generate"
                                                        ? "block py-2 pl-3 pr-4 text-black bg-lightest-purple rounded dark:bg-blue-600"
                                                        : "block py-2 pl-3 pr-4 text-black rounded dark:bg-blue-600"
                                                }
                                            >
                                                Generate New QR Tags
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="/generated-tag-list"
                                                className={
                                                    page ===
                                                    "generated-tags-list"
                                                        ? "block py-2 pl-3 pr-4 text-black bg-lightest-purple rounded dark:bg-blue-600"
                                                        : "block py-2 pl-3 pr-4 text-black rounded dark:bg-blue-600"
                                                }
                                            >
                                                Download QR Tags
                                            </a>
                                        </li>
                                    </>
                                )}
                            </SignedIn>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
};
