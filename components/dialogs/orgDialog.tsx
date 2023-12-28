import React, { useCallback, useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import MainButton from '@/components/ui/mainButton';
import { XIcon } from 'lucide-react';
import MainInput from '@/components/ui/mainInput';
import * as Separator from '@radix-ui/react-separator';
import { clerkClient } from '@clerk/nextjs';

const OrgDialog = ({ open, setClose, createdBy }: any) => {
  const [name, setName] = useState('');
  const [localOpen, setLocalOpen] = useState(false);

  useEffect(() => {
    open && setLocalOpen(open);
  }, [open]);
  
  const handleAdd = useCallback(
    async () => {
      console.log('handleAddData data');

      const createdOrg = await fetch('/api/clerk/createOrganization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          createdBy
        }),
      });

      console.log('createdOrg: ', createdOrg);      

      setLocalOpen(false);
      setClose && setClose();
    },
    [name, setClose, setLocalOpen]
  );
  
  return (
    <Dialog.Root open={localOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="transition-all  data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow backdrop-blur-md fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-zinc-800 bg-opacity-20 border-solid border border-zinc-700  shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className=" m-0 text-[17px] px-4 pt-4">
            Create Organization
          </Dialog.Title>
          <Separator.Root className="mb-[15px] border-b border-solid pb-4 border-b-zinc-600"></Separator.Root>
          {/* <Dialog.Description className="mt-[10px] mb-5 text-xs text-[15px] leading-normal">
            Make changes to your profile here. Click save when you're done.
          </Dialog.Description> */}
          <div className='px-4'>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleAdd();
              }}
            >
              <fieldset className="mb-[15px] items-center gap-5 mt-4">
              <MainInput
                label="Name"
                placeholder="Enter Data name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              </fieldset>
              
              
              <div className="mt-[25px] mb-4 flex justify-end">
                <Dialog.Close asChild>
                  <MainButton type="submit" textSize='text-sm'>Save</MainButton>
                </Dialog.Close>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
)};

export default OrgDialog;