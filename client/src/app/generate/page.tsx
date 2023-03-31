'use client';
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from './page.module.css'
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs/app-beta/client';
import { useQRCode } from 'next-qrcode';
import { useState } from 'react';
import { setHttpClientAndAgentOptions } from 'next/dist/server/config';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
    const [clientEmail, setClientEmail] = useState('');
    const [isGenerated, setIsGenerated] = useState(false);
    const [imageData, setImageData] = useState('');
    const { Canvas } = useQRCode();

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log('submitting form');
        console.log(clientEmail);

        var canvas: HTMLCanvasElement = document.getElementById("qr-canvas-container")?.children[0];
        setImageData(canvas?.toDataURL("image/png", 1.0));

        setIsGenerated(true);
    }

    return (
        <>
            <SignedIn>
                <div className="flex h-screen justify-center py-12 sm:flex-row">
                    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Generate</h2>
                            <p className="mt-2 text-lg leading-8 text-gray-600">Create a new QR Code for a client</p>
                        </div>
                        <form action="#" method="POST" className="mx-auto mt-16 max-w-xl sm:mt-20">
                            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                                {/* <div>
                                    <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900">First name</label>
                                    <div className="mt-2.5">
                                    <input type="text" name="first-name" id="first-name" autoComplete="given-name" className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-gray-900">Last name</label>
                                    <div className="mt-2.5">
                                    <input type="text" name="last-name" id="last-name" autoComplete="family-name" className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                    </div>
                                </div> */}
                                <div className="sm:col-span-2">
                                    <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">Email</label>
                                    <div className="mt-2.5">
                                    <input type="email" name="email" id="email" autoComplete="email" className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" onChange={(e) => setClientEmail(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-10">
                                <button type="submit" className="block w-full rounded-md bg-secondary px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-[#f2e5fe] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f0e2fc]-600" onClick={(e) => handleSubmit(e)}>Generate QR Code</button>
                            </div>
                        </form>
                    </div>
                    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
                        <div id="qr-canvas-container">
                            <Canvas 
                                text={"https://pawfurever.com/"+clientEmail+"/"}
                                options={{
                                    level: 'M',
                                    margin: 3,
                                    scale: 4,
                                    width: 400,
                                    color: {
                                    dark: '#000000',
                                    light: '#f0e2fc',
                                    },
                                }}
                            />
                        </div>
                        <div className="mx-auto max-w-2xl text-center py-4">
                            { isGenerated && (
                                <a href={imageData} download="qr-code.png" className="block w-full rounded-md bg-secondary px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-[#f2e5fe] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f0e2fc]-600">Download QR Code</a>
                            )}
                        </div>
                    </div>
                </div>
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </>
    )
}
