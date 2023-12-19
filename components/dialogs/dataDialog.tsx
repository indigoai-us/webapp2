import React, { useCallback, useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import MainButton from '@/components/ui/mainButton';
import { XIcon } from 'lucide-react';
import MainInput from '@/components/ui/mainInput';
import * as Separator from '@radix-ui/react-separator';

interface DataValueProps {
  addData?: (dataToBeAdded: object) => void;
  noButton?: boolean;
  open?: boolean;
  setClose?: () => void;
}

const DataDialog = (props: DataValueProps) => {
  const { addData, open, setClose } = props;
  const [name, setName] = useState('');
  const [localOpen, setLocalOpen] = useState(false);

  useEffect(() => {
    open && setLocalOpen(open);
  }, [open]);

  const handleAddData = useCallback(
    async () => {
      console.log('handleAddData data');

      // Create new data object on server and return w/ ID
      const newData = {
        type: 'text',
        optionsLocked: false,
        name,
        options: [],
        value: ''
      };

      addData && addData(newData);
      handleClose();
    },
    [addData, name]
  );

  const handleClose = () => {
    setLocalOpen(false);
    setClose && setClose();
  }


  
  return (
    <Dialog.Root open={localOpen}>
      {!props.noButton && 
        <Dialog.Trigger asChild>
          <MainButton textSize='text-sm' onClick={() => setLocalOpen(true)}>Add Data</MainButton>
        </Dialog.Trigger>  
      }
      <Dialog.Portal>
        <Dialog.Overlay className="transition-all  data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow backdrop-blur-md fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-zinc-800 bg-opacity-20 border-solid border border-zinc-700  shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className=" m-0 text-[17px] px-4 pt-4">
            Add Data
          </Dialog.Title>
          <Separator.Root className="mb-[15px] border-b border-solid pb-4 border-b-zinc-600"></Separator.Root>
          {/* <Dialog.Description className="mt-[10px] mb-5 text-xs text-[15px] leading-normal">
            Make changes to your profile here. Click save when you're done.
          </Dialog.Description> */}
          <div className='px-4'>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleAddData();
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
                <MainButton type="submit" textSize='text-sm' onClick={handleAddData}>Save</MainButton>
              </Dialog.Close>
            </div>
          </form>
          <Dialog.Close asChild>
            <button
              className=" absolute top-[10px] right-[10px] inline-flex h-[20px] w-[20px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
              onClick={handleClose}
            >
              <XIcon />
            </button>
          </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
)};

export default DataDialog;