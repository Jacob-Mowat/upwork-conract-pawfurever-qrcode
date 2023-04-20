'use client';
import { useState } from 'react';
import styles from './page.module.css';
import { RedirectToSignIn, SignedIn, SignedOut, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import TagAddDetailsView from './TagAddDetailsView.component';

interface TagSetupKeyViewProps {
    tag: any;
};

export default function TagSetupKeyView({ tag }: TagSetupKeyViewProps) {
    const [setupKey, setSetupKey] = useState<string>('');
    const [validSetupKey, setValidSetupKey] = useState<boolean>(false);

    const user = useUser();
    // const router = useRouter();

    const verifySetupKey = (e: any) => {
        e.preventDefault();

        if (setupKey === tag.setup_key) {
            console.log('Setup key matches!');
            setValidSetupKey(true);
        } else {
            console.log('Setup key does not match!');
            setValidSetupKey(false);
        }
    }

    return (
        <>
            { (!validSetupKey) ? (
                <div className="flex justify-center items-center">
                    <div className="absolute top-[96px]">
                        <h1 className="text-headingCustom underline font-josefin text-black-400 text-center">Verify QR</h1>
                    </div> 
                    <div className="flex flex-col justify-center items-center">
                        <span className="text-black-300 font-josefin text-baseCustom p-[16px]">Please enter the setup key shown below your QR tag</span>
                        <input type="text" className="border-1 border-black-400 bg-cream shadow-[inset_0_4px_10px_5px_rgba(0,0,0,0.1)] w-[calc(100vw-72px)] text-center font-josefin text-base text-[rgba(0,0,0,0.75)]-400" placeholder="AAA-0000" pattern="[A-Za-z]{3}-[0-9]{4}" onChange={(e) => setSetupKey(e.target.value)}/>
                    </div>
                    <button className="absolute bottom-[36px] w-[calc(100%-72px)] bg-dark-purple text-cream h-[48px]" onClick={(e) => verifySetupKey(e)}>CONTINUE</button>
                </div>
            ) : ( 
                <TagAddDetailsView tag={tag} />
            )}
        </>
    )
}
