"use client";

import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'

export default function Header() {

  return (
    <div className="flex flex-row justify-between items-center p-2">
      <UserButton afterSignOutUrl="/"/>
    </div>
  )
}
