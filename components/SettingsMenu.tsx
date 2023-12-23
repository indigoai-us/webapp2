import React from 'react';
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdownMenu"
import { useRouter } from 'next/router';
import { CogIcon, ArrowLeftOnRectangleIcon, UserIcon, BuildingLibraryIcon, CreditCardIcon, UsersIcon  } from '@heroicons/react/20/solid';
import { useClerk, useUser } from "@clerk/clerk-react";
import Image from 'next/image';

const SettingsMenu = ({handleLogout}: any) => {
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='text-zinc-600 outline-none'>
        {/* <CogIcon width={20} className='text-zinc-600 outline-none'/> */}
        <img src={user ? user.imageUrl : ''} 
          className='w-10 h-10 rounded-full relative left-3 border-gray-500 border hover:border-indigo-500 hover:border-[2px]' 
          alt="User"
        />        
      </DropdownMenuTrigger>
      <DropdownMenuContent className='border-zinc-800 backdrop-blur-xl py-3 px-3'>
        <DropdownMenuItem
          className='rounded-md mb-1 hover:bg-zinc-800 px-3'
          onSelect={() => router.push('/profile')}
        >
          <UserIcon className='w-4 h-4 text-zinc-600 mr-4' />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className='rounded-md mb-1 hover:bg-zinc-800 px-3'
          onSelect={() => router.push('/organization')}
        >
          <BuildingLibraryIcon className='w-4 h-4 text-zinc-600 mr-4' />
          <span>Organization</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className='rounded-md mb-1 hover:bg-zinc-800 px-3'
          onSelect={() => router.push('/billing')}
        >
          <CreditCardIcon className='w-4 h-4 text-zinc-600 mr-4' />
          <span>Billing</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className='rounded-md mb-1 hover:bg-zinc-800 px-3'
          onSelect={() => router.push('/members')}
        >
          <UsersIcon className='w-4 h-4 text-zinc-600 mr-4'/>
          <span>Members</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className='border-zinc-700' />
        <DropdownMenuItem
          className='rounded-md mb-1 hover:bg-zinc-800 px-3'
          onSelect={() => signOut(() => router.push("/"))}
        >
          <ArrowLeftOnRectangleIcon className='w-4 h-4 text-zinc-600 mr-4' />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SettingsMenu;