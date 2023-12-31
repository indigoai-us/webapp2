import React, { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { MoreHorizontalIcon } from 'lucide-react';
import Link from 'next/link';

type DataMenuProps = {
  id: string;
  onDelete?: (data: string) => void;
  editRoute?: (data: string) => void;
};

const DataMenu = (props: DataMenuProps) => {
  const { id, onDelete, editRoute } = props;
  const [open, setOpen] = useState(false);

  const handleOnDelete = (e: any) => {
    e.stopPropagation();
    onDelete && onDelete(id);
    setOpen(false);
  }

  const handleEditRoute = (e: any) => {
    e.stopPropagation();
    editRoute && editRoute(id);
    setOpen(false);
  }

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          className="rounded-full inline-flex items-center justify-center"
          aria-label="Customise options"
          onClick={() => setOpen(!open)}
        >
          <MoreHorizontalIcon className="w-4 h-4 text-slate-500 transition-all hover:text-slate-100" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className=" bg-zinc-800 transition-all bg-opacity-0 backdrop-blur-sm rounded-md border border-zinc-700 p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
          sideOffset={5}
        >
          <DropdownMenu.Item 
            className="group transition-all hover:bg-indigo-600 text-xs leading-none rounded-[3px] flex items-center h-[25px] px-[5px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1"
            onSelect={handleEditRoute}
          >
            <Link href={"/library/data/"+id}>
              Edit Data{' '}
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item 
            className="group transition-all hover:bg-indigo-600 text-xs leading-none rounded-[3px] flex items-center h-[25px] px-[5px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1"
            onSelect={handleOnDelete}
          >
            Delete Data{' '}            
          </DropdownMenu.Item>
          

        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default DataMenu;