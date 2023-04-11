import Image from 'next/image'

// TODO: check if this is a better way to import fonts
// import { Josefin_Sans } from 'next/font/google'

import styles from './page.module.css';

export default function Home() {
  return (
    <>
      <div className="flex h-screen justify-center items-center">
        <div className="text-center">
          This is the index Page
        </div>
      </div>
    </>
  )
}
