import { Switch } from "@/components/ui/switch"
import Link from 'next/link';
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { ChatBubbleLeftRightIcon, ClipboardDocumentIcon, EyeIcon } from '@heroicons/react/20/solid';
import { useAuth } from "@clerk/nextjs";
import authedFetch from "@/lib/authedFetch";

interface CommandCardProps {
  command: any;
  userAdmin?: any;
}
  
const CommandCard: React.FC<CommandCardProps> = ({ command, userAdmin }) => {
  const [commandData, setCommandData] = useState(command);
  const router = useRouter();
  const { getToken } = useAuth();

  useEffect(() => {    
    const OneDay = new Date().getTime() - (1 * 24 * 60 * 60 * 1000);
    const commandDate = new Date(command.createdAt).getTime();
    const isNew = commandDate > OneDay;
    setCommandData({...command, isNew});    
    const commandUpdated = new Date(command.updatedAt).getTime();
    const isUpdated = commandUpdated > OneDay;
    setCommandData({...command, isNew, isUpdated});
  } ,[command]);

  const handleUpdateCommand = useCallback(
    async (update: {field: string, value: any}) => {

      const newCommand = {
        ...command,
        model: command.model._id,
        [update.field]: update.value,
      }            

      const data = await authedFetch(`/commands/${newCommand._id}`, 'PUT', newCommand, getToken);
      console.log('handleUpdateCommand data:', data);   

      setCommandData(newCommand);
    },
    [command, getToken]
  );

  const handleRoute = () => {
    userAdmin && router.push("/library/command/"+commandData._id);
  }  

  return (
    <div className="group rounded-xl drop-shadow-sm bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700 shadow-sm hover:border-indigo-500 hover:shadow-glow  border border-solid p-4 text-xs flex transition-colors">
      <div className="flex-1">
        <div onClick={handleRoute} className="cursor-pointer">
          <p className="text-zinc-500 ">
            {commandData.vanityId}
            {commandData.isNew && <span className="text-xs text-orange-300 ml-2">NEW</span>}
            {!commandData.isNew && commandData.isUpdated && <span className="text-xs text-green-300 ml-2">UPDATED</span>}
          </p>
          
          <h3 className="my-1 text-sm">{commandData.name}</h3>
          
          <p className="text-zinc-500 ">{commandData.description}</p>
        </div>
      </div>
      <div className="flex-none z-10">
        {userAdmin && <Switch checked={commandData.status} onCheckedChange={(e) => handleUpdateCommand({field: 'status', value: !commandData.status})}/>}
      </div>
      <div className="absolute bottom-2 right-4 flex">
        {commandData.assistant && <ChatBubbleLeftRightIcon className="text-orange-300 w-5 h-5 mx-1"/>}
        {commandData.usesCopied && <ClipboardDocumentIcon className="text-green-200 w-5 h-5 mx-1" />}
        {commandData?.model?.nameCode === 'gpt-4-vision-preview' && <EyeIcon className="text-indigo-100 w-5 h-5 mx-1" />}
      </div>
    </div>
  );
};
  
  export default CommandCard;