import {
  ClerkProvider,
} from "@clerk/nextjs/app-beta";
import { UserButton } from "@clerk/nextjs/app-beta/client";
import './globals.css'

// TODO: Not sure if this is needed anymore.
export const metadata = {
  title: 'Dog QR Tagger',
  description: 'Next.js app for tagging dogs with QR codes',
}



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <div className="flex flex-row w-full h-16 bg-primary items-center border-b-2">
            <div className="flex-none px-8">
              <img src="https://cdn.shopify.com/s/files/1/0584/8714/4505/files/PawFurEver-03_125x.png?v=1650435807" width="64" height="64" alt="PawFurEver" />
            </div>

            <div className="grow text-center text-2xl">
              PawFurEver - QR
            </div>
            <div className="flex-none px-8">
              <UserButton />
            </div>
          </div>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
