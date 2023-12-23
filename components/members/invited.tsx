import React from 'react'
import Link from 'next/link';
import * as Avatar from '@radix-ui/react-avatar';
import MemberMenu from '@/components/members/memberMenu';
import InvitedMenu from './invitedMenu';


type InvitedProps = {
  memberName: string;
  memberType: string;
  pending: boolean;
  data: object;
  onCancel?: (id: object) => void;
};

const Invited: React.FC<InvitedProps> = ({ memberName, memberType, pending, data, onCancel }) => {

  const handleCancel = () => {
    onCancel && onCancel(data);
  }    

  return (
    <div className="flex group pb-1 pt-3 w-full cursor-pointer">
      <div className='flex w-1/3 mr-20 ml-2 text-sm '>{memberName}</div>
      <div className='text-xs flex flex-grow py-1 text-slate-500'>{memberType}</div>
      <div className='flex flex-none justify-end'>
          
        <InvitedMenu data={data} onCancel={handleCancel}/>
      </div>
    </div>
  );
}

export default Invited;