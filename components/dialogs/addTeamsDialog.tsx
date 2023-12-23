import React, {useEffect, useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import MainButton from '@/components/ui/mainButton';
import { XIcon } from 'lucide-react';
import InputLabel from '@/components/ui/inputLabel';
import { PlusIcon } from '@heroicons/react/20/solid';
import ControlledMultiSelect from '@/components/ui/controlledMultiSelect';

const AddTeamsDialog = ({teams, submitNewTeams, initialTeams}: any) => {
  const [teamOptions, setTeamOptions] = useState<any>(teams);
  const [data, setData] = useState([]);

  useEffect(() => {    
    if(initialTeams) {
      const newSelectedTeams = initialTeams.map((team: any) => {
        const selectedTeam = teams.find((t: any) => t._id === team);
        return {
          value: selectedTeam._id,
          label: selectedTeam.name
        }
      })
      setData(newSelectedTeams);  

    }
  }, [initialTeams, teams]);

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

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
      <div className='flex cursor-pointer'>
        <div><PlusIcon className='w-4 h-4 mr-3' /></div>
        <div className="text-xs text-slate-500">{`Add Team(s)`}</div>
      </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="transition-all  data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow backdrop-blur-md fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-zinc-800 bg-opacity-20 border-solid border border-zinc-700 p-[20px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className=" m-0 text-[17px]">
            {`Add Team(s)`}
          </Dialog.Title>
          {/* <Dialog.Description className="mt-[10px] mb-5 text-xs text-[15px] leading-normal">
            Make changes to your profile here. Click save when you're done.
          </Dialog.Description> */}
          
          <fieldset className="mb-[15px] items-center gap-5 mt-4">
            <InputLabel label="Add to Command"/>
            <ControlledMultiSelect
              options={teamOptions}
              placeholder="Select team(s)..."
              onChange={(value) => setData(value)}
              value={data}
            />
          </fieldset>
                    
          <div className="mt-[25px] flex justify-end">
            <Dialog.Close asChild>
              <MainButton textSize='text-sm' onClick={() => submitNewTeams(data)}>Save</MainButton>
            </Dialog.Close>
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
export default AddTeamsDialog;