import React from 'react';
import Icon from '@/components/ui/icon';

type TeamProps = {
  name: string;
  teamName: string;
  numMembers?: number;
  data: object;
  handleEdit?: (id: object) => void;
};

const Team: React.FC<TeamProps> = ({ name, teamName, numMembers, handleEdit, data }) => {
 
  const editRoute = () => {
    handleEdit && handleEdit(data);
  }
  
  return (
    <div className="flex group py-1 cursor-pointer" onClick={editRoute}>
      <div className='flex-none mt-0.5'><Icon name={name} size={14} /></div>
      <div className='flex-none mr-20 ml-2 text-sm '>{teamName}</div>
      <div className='text-xs flex-none py-1 text-slate-500 pt-0.5 opacity-0 group-hover:opacity-100  transition-all'>
        {numMembers} member{numMembers !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

export default Team;