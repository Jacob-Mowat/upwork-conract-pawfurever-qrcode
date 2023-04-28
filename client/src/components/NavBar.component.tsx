import {
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton,
    useUser,
} from "@clerk/nextjs";
import { useState } from "react";

interface NavbarProps {
    page?: string;
}

export const Navbar = ({ page }: NavbarProps) => {
    const [isHidden, setIsHidden] = useState<boolean>(true);

    const { user } = useUser();

    return (
        <>
            {/* <div className="flex w-screen h-16 bg-cream items-center justify-between border-b-2 border-lightest-purple">
                <div className="flex flex-1 justify-center mr-auto">
                    <button
                        data-collapse-toggle="navbar-hamburger"
                        type="button"
                        className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="navbar-hamburger"
                        aria-expanded="false"
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
                                fill-rule="evenodd"
                                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clip-rule="evenodd"
                            ></path>
                        </svg>
                    </button>
                </div>
                <div className=""> */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {/* <img
                        src="https://cdn.shopify.com/s/files/1/0584/8714/4505/files/paw-logo_200x.png?v=1647452909"
                        width="200"
                        height="64"
                        alt="PawFurEver"
                        className="align-middle"
                    />
                </div>
                <div className="flex flex-1 justify-center ml-auto">
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                    <SignedOut>
                        <SignInButton />
                    </SignedOut>
                </div>
            </div>
            <div className="hidden w-full" id="navbar-hamburger">
                <ul className="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                    <li>
                        <a
                            href="#"
                            className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded dark:bg-blue-600"
                            aria-current="page"
                        >
                            Home
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                            Services
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                            Pricing
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                            Contact
                        </a>
                    </li>
                </ul>
            </div> */}
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
                                fill-rule="evenodd"
                                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clip-rule="evenodd"
                            ></path>
                        </svg>
                    </button>
                    <a href="#" className="flex items-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="https://cdn.shopify.com/s/files/1/0584/8714/4505/files/paw-logo_200x.png?v=1647452909"
                            width="200"
                            height="64"
                            alt="PawFurEver"
                            className="align-middle"
                        />
                    </a>
                    <UserButton />
                    <div
                        className={isHidden ? "hidden w-full" : "w-full"}
                        id="navbar-hamburger"
                    >
                        <ul className="flex flex-col font-medium mt-4 rounded-lg bg-cream dark:bg-gray-800 dark:border-gray-700">
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
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
};
