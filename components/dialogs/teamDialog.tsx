import React, {useEffect, useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import MainButton from '@/components/ui/mainButton';
import { XIcon } from 'lucide-react';
import InputLabel from '@/components/ui/inputLabel';
import MainInput from '@/components/ui/mainInput';
import ChooseIcon from '@/components/chooseIcon';
import ControlledMultiSelect from '@/components/ui/controlledMultiSelect';

const initialMemberOptions = [
  { value: 'member1', label: 'Member 1' },
  { value: 'member2', label: 'Member 2' },
  { value: 'member3', label: 'Member 3' },
  // ... add more options as needed
];

const defaultData = {
  name: '',
  users: [],
  icon: 'UsersIcon'
}

const TeamDialog = ({members, submitNewTeam, selectedTeam, handleClose, deleteTeam, saveExistingTeam}: any) => {
  const [memberOptions, setMemberOptions] = useState<any>(initialMemberOptions);
  const [data, setData] = useState(defaultData);

  useEffect(() => {
    if(!selectedTeam || selectedTeam === 'new') {
      setData(defaultData);
    } else {      
      const selectedTeamMembers = selectedTeam.users.map((member: any) => {
        return {
          value: member._id,
          label: member.first_name+' '+member.last_name+' ('+member.email+')'
        }
      })
      setData({...selectedTeam, users: selectedTeamMembers});
    }
  }, [selectedTeam]);

  useEffect(() => {    
    if(members) {
      const newMemberOptions = members.map((member: any) => {
        return {
          value: member._id,
          label: member.first_name+' '+member.last_name+' ('+member.email+')'
        }
      })
      setMemberOptions(newMemberOptions);  
    }
  }, [members]);

  const setSelectedIcon = (icon: any) => {
    setData({...data, icon: icon});
  }

  const onClose = () => {    
    handleClose && handleClose();
  }

  const handleTeam = (data: any) => {
    if(selectedTeam === 'new') {
      submitNewTeam && submitNewTeam(data);
    } else {
      saveExistingTeam && saveExistingTeam(data);
    }
  }

  return (
    <Dialog.Root open={selectedTeam} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="transition-all  data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow backdrop-blur-xl fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-zinc-950 bg-opacity-30 border-solid border border-zinc-700 p-[20px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className=" m-0 text-[17px]">
          {selectedTeam === 'new' ? 'Add Team' : 'Edit Team'}
          </Dialog.Title>
          {/* <Dialog.Description className="mt-[10px] mb-5 text-xs text-[15px] leading-normal">
            Make changes to your profile here. Click save when you're done.
          </Dialog.Description> */}
          <fieldset className="mb-[15px] items-center gap-5 mt-4">
            <MainInput
              label="Name"
              type="text"
              name="name"
              value={data.name}
              placeholder="Enter team email..."
              onChange={(e) => setData({ ...data, [e.target.name]: e.target.value })}
            />
          </fieldset>
          <fieldset className="mb-[15px] items-center gap-5 mt-4">
            <h3>Members</h3>
            <InputLabel label=''/>
            <ControlledMultiSelect
              options={memberOptions}
              placeholder="Select inputs..."
              value={data.users}
              onChange={(value) => setData({ ...data, users: value })}
            />
          </fieldset>

          <h3>Select Icon</h3>

          <ChooseIcon setSelectedIcon={setSelectedIcon} initialIcon={data.icon}/>
                    
          <div className="mt-[25px] flex justify-end">
            {selectedTeam !== 'new' &&
              <MainButton className='mr-2' textSize='text-sm' onClick={() => deleteTeam(data)}>Delete</MainButton>
            }
            <MainButton textSize='text-sm' onClick={() => handleTeam(data)}>Save</MainButton>
          </div>
          <Dialog.Close asChild>
            <button
              className=" absolute top-[10px] right-[10px] inline-flex h-[20px] w-[20px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <XIcon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
export default TeamDialog;