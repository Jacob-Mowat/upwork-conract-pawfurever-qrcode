'use client';
import styles from './page.module.css';
import { RedirectToSignIn, SignedIn, SignedOut, useUser } from '@clerk/nextjs';

interface TagViewProps {
    tag: any;
};

export default function TagView({ tag }: TagViewProps) {
    const user = useUser();

    return (
        <>
            <div className="flex justify-center items-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold">Viewing a Tag</h1>
                    <span>{tag.id}</span>
                    <span>{tag.TAG_TOKEN}</span>
                </div>
            </div>
        </>
    )
}
