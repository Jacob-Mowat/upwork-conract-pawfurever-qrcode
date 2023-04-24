import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export const Navbar = () => {
    return (
        <div className="flex fixed w-screen h-16 bg-cream items-center justify-between border-b-2 border-lightest-purple">
            <div className="flex flex-1 justify-center mr-auto"></div>
            <div className="">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
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
    );
};
