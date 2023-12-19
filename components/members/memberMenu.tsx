import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { MoreHorizontalIcon } from 'lucide-react';

type InputMenuProps = {
  data: object;
  onDelete?: (input: object) => void;
  editRoute?: (input: object) => void;
};

const memberMenu = (props: InputMenuProps) => {
  const { data, onDelete, editRoute } = props;
  const [bookmarksChecked, setBookmarksChecked] = React.useState(true);
  const [urlsChecked, setUrlsChecked] = React.useState(false);
  const [person, setPerson] = React.useState('pedro');

  const handleOnDelete = () => {
    onDelete && onDelete(data);
  }

  const handleEditRoute = () => {
    editRoute && editRoute(data);
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="rounded-full inline-flex items-center justify-center"
          aria-label="Customise options"
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
            Edit Member{' '}            
          </DropdownMenu.Item>
          <DropdownMenu.Item 
            className="group transition-all hover:bg-indigo-600 text-xs leading-none rounded-[3px] flex items-center h-[25px] px-[5px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1"
            onSelect={handleOnDelete}
          >
            Delete Member{' '}            
          </DropdownMenu.Item>
          

        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default memberMenu;