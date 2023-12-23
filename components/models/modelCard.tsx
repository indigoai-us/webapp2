import { Switch } from "@/components/ui/switch"
import Image from "next/image";
import { useEffect, useState } from "react";

interface ModelCardProps {
  model: any;
  handleUpdateModel: any;
  selectModel: any;
}
  
const ModelCard: React.FC<ModelCardProps> = ({ model, handleUpdateModel, selectModel }) => {
  const [modelData, setModelData] = useState(model);

  useEffect(() => {
    setModelData(model);
  }, [model]);

  const updateModel = async({e, field, value}: any) => {
    e.stopPropagation();    
    const body = {
      [field]: value
    }
    handleUpdateModel({body, model: modelData});
  }
    

  return (
    <div className="group rounded-xl drop-shadow-sm bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700 shadow-sm hover:border-indigo-500 hover:shadow-glow  border border-solid p-4 text-xs flex transition-colors">
      <div className="flex-grow">
      <div className="flex flex-row cursor-pointer w-3/4 items-center" onClick={() => selectModel(modelData)}>
        
        
        <span className="flex flex-row w-[220px] mr-2">
          <Image 
            src={modelData.icon} 
            className="w-6 h-6 rounded-full" 
            alt="Icon" 
            height={40}
            width={40}
            />
          <h3 className="my-1 text-sm ml-2">{modelData.name}</h3>
        </span>
        <span className="text-gray-500 w-[120px] mr-2 ">
          {modelData.provider}
        </span>
        
        <span className="text-gray-500 ">{modelData.description}</span>
      </div>
      </div>
      <div className="flex-none z-10 cursor-pointer" onClick={() => selectModel(modelData)}>
        {model.customApiKeyRequired 
          ? <div className="items-center flex h-full text-xs text-gray-500">COMING SOON</div>
          : <Switch checked={modelData.active} onClick={(e) => updateModel({e, field: 'active', value: !modelData.active})}/>         
        }
      </div>
    </div>
  );
};
  
  export default ModelCard;