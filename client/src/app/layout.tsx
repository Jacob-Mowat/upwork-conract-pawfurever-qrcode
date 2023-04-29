import { ClerkProvider } from "@clerk/nextjs/app-beta";
import "./globals.css";
import { Josefin_Sans } from "next/font/google";

const josefin = Josefin_Sans({ weight: "400", subsets: ["latin"] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={josefin.className + " bg-cream overflow-x-hidden"}>
                <ClerkProvider>{children}</ClerkProvider>
            </body>
        </html>
    );
}
