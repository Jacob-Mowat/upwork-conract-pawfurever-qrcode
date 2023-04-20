'use client';
import styles from './page.module.css';
import { RedirectToSignIn, SignedIn, SignedOut, useUser } from '@clerk/nextjs';

interface TagAddDetailsViewProps {
    tag: any;
};

export default function TagAddDetailsView({ tag }: TagAddDetailsViewProps) {
    const user = useUser();

    return (
        <>
            <div className="flex h-screen justify-center items-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold">Add tag details view</h1>
                </div>
            </div>
        </>
    )
}
