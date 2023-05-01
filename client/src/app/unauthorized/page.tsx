"use client";
import { Navbar } from "@/src/components/NavBar.component";
import Link from "next/link";

export default function UnauthorizedPage() {
    return (
        <>
            <Navbar page="generate" />
            <div className="flex justify-center py-12 sm:flex-col md:flex-col">
                <div className="isolate bg-cream px-6 py-24 sm:py-32 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <div className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Unauthorized!
                        </div>
                        <div className="mt-2 text-xl leading-8 text-gray-600">
                            You are not an admin, please return to the{" "}
                            <Link
                                className="text-purple hover:text-light-purple hover:underline"
                                href="/"
                            >
                                homepage
                            </Link>
                            .
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
