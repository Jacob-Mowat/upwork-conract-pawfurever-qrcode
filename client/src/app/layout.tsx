import './globals.css'

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
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
