import React from 'react'
import Link from 'next/link';
import * as Avatar from '@radix-ui/react-avatar';
import MemberMenu from '@/components/members/memberMenu';


type MemberProps = {
  memberName: string;
  memberType: string;
  pending: boolean;
  initials: string;
  icon: React.ComponentType<{ className?: string }>;
  data: object;
  onDelete?: (id: object) => void;
  handleEditRoute?: (id: object) => void;
};

const Team: React.FC<MemberProps> = ({ icon: IconComponent, memberName, memberType, pending, initials, data, onDelete, handleEditRoute }) => {

  const editRoute = () => {
    handleEditRoute && handleEditRoute(data);
  }    

  return (
    <div className="flex group pb-1 pt-3 w-full cursor-pointer" onClick={editRoute}>
      {/* <div className='flex-none mt-0.5'>
        <div className='block relative mr-5'>
        <Avatar.Root className="AvatarRoot absolute -mt-1.5 -ml-1 ">
        <Avatar.Image
          className="AvatarImage w-6 rounded-full"
          src="/logo.jpg"
          alt="Colm Tuite"
        />
        <Avatar.Fallback className="AvatarFallback text-xs bg-slate-700 rounded-full p-1" delayMs={600}>
          {initials}
        </Avatar.Fallback>
        </Avatar.Root>    
        </div>
      </div> */}
      <div className='flex w-1/3 mr-20 ml-2 text-sm '>{memberName}</div>
      <div className='text-xs flex flex-grow py-1 text-slate-500'>{memberType}</div>
      <div className='flex flex-none justify-end'>
          
        {/* <MemberMenu data={data} onDelete={onDelete} editRoute={handleEditRoute}/> */}
      </div>
    </div>
  );
}

export default Team;