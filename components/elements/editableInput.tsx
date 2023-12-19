import { Check, XCircleIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface EditableInputProps {
  initialInput: string;
  onRemove?: (index: number) => void;
  index: number;
  option: object;
  onUpdate?: (index: number, text: string, option: object) => void;
}

const EditableInput: React.FC<EditableInputProps> = ({ initialInput, onRemove, index, onUpdate, option }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [input, setInput] = useState(initialInput);

  const handleEdit = () => {
    if(!isEditing) {
      setIsEditing(!isEditing);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  useEffect(() => {
    setInput(initialInput);
  }, [initialInput]);

  const handleOnRemove = () => {    
    if (onRemove) {
      onRemove(index);
      setIsEditing(false);
    }
  }

  const handleOnUpdate = () => {
    if (onUpdate) {
      onUpdate(index, input, option);
      setIsEditing(false);
    }
  }

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      handleOnUpdate();
    }
  };

  return (
    <div style={{display: 'flex', width: '100%'}}>
      <div 
        onDoubleClick={handleEdit}
        className="border border-solid border-zinc-700 p-2 mt-2 rounded-md backdrop-brightness-75	 hover:border-zinc-500"
        style={{width: '100%'}}
      >
        {isEditing ? (
          <input 
            className="w-full bg-transparent text-sm text-white outline-none caret-indigo-600" 
            value={input} 
            onChange={handleInputChange} 
            onBlur={handleEdit} 
            onKeyPress={handleKeyPress}
            autoFocus
          />
        ) : (
          <TooltipProvider>
          
          <Tooltip>
            <TooltipTrigger>
            <h2 className='text-sm font-light w-full text-left'>{input}</h2>
            </TooltipTrigger>
            <TooltipContent className='TooltipContent'>
              <p>Double-click to edit</p>
            </TooltipContent>
          </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {onRemove && isEditing &&
        <button
          className="text-xs text-slate-500 hover:text-white transition-all"
          onClick={handleOnRemove}
          style={{marginLeft: 5}}
        >
          <XCircleIcon width={20} />
        </button>
      }
      {
        onUpdate && isEditing &&
        <button
          className="text-xs text-slate-500 hover:text-white transition-all"
          onClick={handleOnUpdate}
          style={{marginLeft: 5}}
        >
          <Check width={20} />
        </button>        
      }
    </div>
  );
};

export default EditableInput;
