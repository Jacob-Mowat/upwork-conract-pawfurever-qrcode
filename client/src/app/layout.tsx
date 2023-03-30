import {
  ClerkProvider,
} from "@clerk/nextjs/app-beta";
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
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
