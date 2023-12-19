import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import MainButton from '@/components/ui/mainButton';
import { XIcon } from 'lucide-react';
import * as Separator from '@radix-ui/react-separator';

interface InputValueProps {
  handleConfirm?: (input: object) => void;
  description?: string;
  open?: boolean;
  handleClose?: () => void;
}

const ChoiceDialog = (props: InputValueProps) => {
  const { handleConfirm, description, open, handleClose } = props;
  
  const handleOpenChange = (e: any) => {
    console.log('handleOpenChange e: ', e);
    handleClose && handleClose();
  }

  console.log('open: ', open);
  

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="transition-all  data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow backdrop-blur-md fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-zinc-800 border-solid border border-zinc-700  shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-50">
          <Dialog.Title className=" m-0 text-[17px] px-4 pt-4">
            Are You Sure?
          </Dialog.Title>
          <Separator.Root className="mb-[15px] border-b border-solid pb-4 border-b-zinc-600"></Separator.Root>
          <Dialog.Description className="mt-[10px] mb-5 text-xs text-[15px] leading-normal pl-5">
            {description}
          </Dialog.Description>
          <div className='px-4'>
          <div className="mt-[25px] mb-4 flex justify-end">
            <Dialog.Close asChild className="mr-3">
              <MainButton textSize='text-sm' onClick={handleConfirm}>Confirm</MainButton>
            </Dialog.Close>
            <Dialog.Close asChild>
              <MainButton textSize='text-sm' onClick={handleClose}>Cancel</MainButton>
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
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
)};

export default ChoiceDialog;