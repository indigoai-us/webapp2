import React, { use } from 'react';
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdownMenu"
import { useRouter } from 'next/router';
import { CogIcon, ArrowLeftOnRectangleIcon, UserIcon, BuildingLibraryIcon, CreditCardIcon, UsersIcon  } from '@heroicons/react/20/solid';

const SettingsMenu = ({handleLogout}: any) => {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='text-zinc-600 outline-none'><CogIcon width={20} className='text-zinc-600 outline-none'/></DropdownMenuTrigger>
      <DropdownMenuContent className='border-zinc-800 backdrop-blur-xl py-3 px-3'>
        {/* <DropdownMenuItem
          className='rounded-md mb-1 hover:bg-zinc-800 px-3'
          onSelect={() => router.push('/profile')}
        >
          <UserIcon className='w-4 h-4 text-zinc-600 mr-4' />
          <span>Profile</span>
        </DropdownMenuItem> */}
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
          onSelect={handleLogout}
        >
          <ArrowLeftOnRectangleIcon className='w-4 h-4 text-zinc-600 mr-4' />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SettingsMenu;