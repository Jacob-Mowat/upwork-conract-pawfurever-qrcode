import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from './page.module.css'
import { UserButton, UserProfile } from '@clerk/nextjs/app-beta/client'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <div className="flex h-screen justify-center items-center">
      </div>
      <div className="absolute top-0 right-0">
        <UserButton />
      </div>
    </>
  )
}
