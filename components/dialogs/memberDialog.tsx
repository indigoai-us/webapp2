import React, { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import MainButton from '@/components/ui/mainButton';
import { XIcon } from 'lucide-react';
import SingleSelect from '@/components/ui/singleSelect';
import InputLabel from '@/components/ui/inputLabel';
import MainInput from '@/components/ui/mainInput';
import { Input } from 'postcss';
import * as Separator from '@radix-ui/react-separator';
import ControlledMultiSelect from '@/components/ui/controlledMultiSelect';

const memberOptions = [
    { value: 'team1', label: 'Team 1' },
    { value: 'team2', label: 'Team 2' },
    { value: 'team3', label: 'Team 3' },
    // ... add more options as needed
  ];
  const typeOptions = [
    { value: 'member', label: 'Member' },
    { value: 'admin', label: 'Admin' },
    // ... add more options as needed
  ];

  const defaultData = {
    email: '',
    teams: [],
    role: 'member',
    admin: false
  }

const MemberDialog = ({submitNewMember, saveExistingMember, selectedMember, handleClose, deleteMember, teams}: any) => {
  const [data, setData] = useState(defaultData);
  const [teamsOptions, setTeamOptions] = useState<any>(teams);

  useEffect(() => {
    if(!selectedMember || selectedMember === 'new') {
      setData(defaultData);
    } else {
      const selectedMemberTeams = selectedMember.teams?.map((team: any) => {
        const teamData = teams.find((t: any) => t._id === team);
        return {
          value: teamData._id,
          label: teamData.name
        }
      })
      setData({...selectedMember, teams: selectedMemberTeams});
    }
  }, [selectedMember]);

  useEffect(() => {    
    if(teams) {
      const newTeamOptions = teams.map((team: any) => {
        return {
          value: team._id,
          label: team.name
        }
      })
      setTeamOptions(newTeamOptions);  
    }
  }, [teams]);

  const onClose = () => {    
    handleClose && handleClose();
  }

  const handleMember = (data: any) => {
    if(selectedMember === 'new') {
      submitNewMember && submitNewMember(data);
    } else {
      saveExistingMember && saveExistingMember(data);
    }
  }

  const handleOnClose = () => {
    handleClose && handleClose();
  }
    
  return (
    <Dialog.Root open={selectedMember} onOpenChange={handleOnClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="transition-all  data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow backdrop-blur-xl fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-zinc-950 bg-opacity-30 border-solid border border-zinc-700  shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className=" m-0 text-[17px] px-4 pt-4">
            {selectedMember === 'new' ? 'Add Member' : 'Edit Member'}
          </Dialog.Title>
          <Separator.Root className="mb-[15px] border-b border-solid pb-4 border-b-zinc-600"></Separator.Root>
          {/* <Dialog.Description className="mt-[10px] mb-5 text-xs text-[15px] leading-normal">
            Make changes to your profile here. Click save when you're done.
          </Dialog.Description> */}
          <div className='px-4'>
            <fieldset className="mb-[15px] items-center gap-5 mt-4">
              <MainInput
                label="Email"
                type="email"
                name="email"
                value={data.email}
                disabled={selectedMember !== 'new'}
                placeholder="Enter member email..."
                onChange={(e) => setData({ ...data, [e.target.name]: e.target.value })}
              />
            </fieldset>
            <fieldset className="mb-[15px] items-center gap-5 mt-4">

              <InputLabel label="Add to Team(s)"/>
              <ControlledMultiSelect
                options={teamsOptions}
                placeholder="Select inputs..."
                value={data.teams}
                onChange={(value) => setData({ ...data, teams: value })}
              />
            </fieldset>
            <fieldset className="mb-[15px] items-center gap-5 mt-4">
              <InputLabel label="Member Type"/>
              <SingleSelect
                options={typeOptions}
                placeholder="Select member type..."
                initialValue={data.role}
                onChange={(value) => setData({ ...data, role: value.value, admin: value.value === 'admin' })}
              />
            </fieldset>
            
            
            <div className="mt-[25px] mb-6 flex justify-end">
              {selectedMember !== 'new' &&
                <MainButton className='mr-2' textSize='text-sm' onClick={() => deleteMember(data)}>Delete</MainButton>
              }
              <MainButton textSize='text-sm' onClick={() => handleMember(data)}>Save</MainButton>
            </div>
            <Dialog.Close asChild>
              <button
                className=" absolute top-[10px] right-[10px] inline-flex h-[20px] w-[20px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                aria-label="Close"
              >
                <XIcon />
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default MemberDialog;