import React, { useEffect, useState } from 'react';
import MainSlider from '@/components/ui/slider';
import InputLabel from '@/components/ui/inputLabel';
import { MentionsInput, Mention } from 'react-mentions'
import mentionsClass from '@/components/ui/mentions.module.css'
import SingleSelect from '@/components/ui/singleSelect';
import { Switch } from "@/components/ui/switch"
import DataDialog from '@/components/dialogs/dataDialog';
import { toast } from 'react-toastify';
import { useAuth } from "@clerk/nextjs";
import useFetch from '@/lib/useFetch';

const PromptStep = ({updatePromptData, initialData, dataData, models}: any) => {
  const [showSystemMessage, setShowSystemMessage] = useState(true);
  const [localData, setLocalData] = useState(initialData);
  const [data, setData] = useState<any>([]);
  const [prompt, setPrompt] = useState('');
  const [openNewPrompt, setOpenNewPrompt] = useState(false);
  const [modelOptions, setModelOptions] = useState<any>([]);
  const [defaultModelId, setDefaultModelId] = useState<string | null>(null);
  const [maxTokens, setMaxTokens] = useState(2048);
  const { getToken } = useAuth();

  useEffect(() => {
    const {model, temperature, tokens, systemMessage, showSystemMessage} = initialData;    
    const sortedModels = models.sort((a: any, b: any) => a.name.localeCompare(b.name));    

    const modelOptions = sortedModels.map((model: any) => {
      return {
        value: model._id,
        label: model.name,
        max_temperature: model.max_temperature,
        max_tokens: model.max_tokens,
        icon: model.icon,
      }
    });
    setModelOptions(modelOptions);
    const defaultModel = models.find((m: any) => m.nameCode === 'gpt-4');
    // console.log('defaultModel', defaultModel);
    const newModel = model ? model : defaultModel._id;
    setLocalData({model: newModel, temperature, tokens, systemMessage, showSystemMessage});
  },[initialData, models]);    

  useEffect(() => {
    const {rawPromptFrame} = initialData;
    setPrompt(rawPromptFrame);
  },[]);

  useEffect(() => {
    const newData = dataData.map((d: any) => {
      return {
        id: d._id,
        display: '{'+d.name+'}',
      }
    });
    const dataDataWithCopied = [
      {
        id: 'addNew',
        display: '{Add New}',
      },
      {
        id: 'copied',
        display: '{copied}',
      },
      ...newData      
    ]
    setData(dataDataWithCopied);  
  }, [dataData]);

  useEffect(() => {    
    if(modelOptions.length === 0) return;
    const selectedModel = modelOptions.find((m: any) => m.value === localData.model);
    const max_tokens = selectedModel ? selectedModel.max_tokens : 2048;

    if(localData.tokens > max_tokens) {
      setLocalData({...localData, tokens: max_tokens});
    }    
  }, [localData]);

  const handlePromptChange = (event: any, newValue: any, newPlainTextValue: any) => {
    
    const cleanedValue = newValue.replace('@[{Add New}](addNew)', '');
    
    const newPromptLocalData = {
      ...localData,
      rawPromptFrame: cleanedValue,
    };
    setLocalData(newPromptLocalData);
    updatePromptData(newPromptLocalData);
    setPrompt(cleanedValue);
  };

  const handleModelChange = (event: any) => {
    const newPromptLocalData = {
      ...localData,
      model: event.value,
    };
    setLocalData(newPromptLocalData);
    updatePromptData(newPromptLocalData);
  }

  const handleSystemMessageToggle = (event: any) => {
    const newPromptLocalData = {
      ...localData,
      showSystemMessage: !localData.showSystemMessage,
    };
    setLocalData(newPromptLocalData);
    updatePromptData(newPromptLocalData);
  }

  const handleSliderChange = ({field, value}: any) => {
    const newPromptLocalData = {
      ...localData,
      [field]: value,
    };
    console.log('newPromptLocalData', newPromptLocalData);
    
    setLocalData(newPromptLocalData);
    updatePromptData(newPromptLocalData);
  }

  const handleOnAdd = (id: any, display: any) => {
    if(id === 'addNew') {
      setOpenNewPrompt(true);
    }
  }

  const handleSystemMessageChange = (e: any) => {
    setLocalData({ ...localData, [e.target.name]: e.target.value });
    updatePromptData({ ...localData, [e.target.name]: e.target.value });
  };
    
  const handleAddData = async (newData: any) => {

    const dataData = {
      ...newData,
      marketplace: false,
    }

    const createData = async () => {
      const createdData = await useFetch('/data', 'POST', dataData, getToken);
      console.log('got companies:', createdData);   
  
      const formattedData = {
        id: createdData._id,
        display: '{'+createdData.name+'}',
      }

      const newDatas = [...data, formattedData];
      setData(newDatas);
      
      const updatedPrompt = prompt.concat(` @[{${createdData.name}}](${createdData._id})`);
  
      const newPromptLocalData = {
        ...localData,
        rawPromptFrame: updatedPrompt,
      };
      setLocalData(newPromptLocalData);
      updatePromptData(newPromptLocalData);
      setPrompt(updatedPrompt);
    }

    toast.promise(
			createData,
			{
				pending: 'Creating your data...',
				success: {
					render(){
						return 'Sweet, data added! 🎉'
					},
					autoClose: 2000,
					theme: 'dark',
				},
				error: {
					render(){
						return 'On no, something went wrong 🤯'
					},
					autoClose: 2000,
					theme: 'dark'
				}
			}
		);

  }

  return (
    <div className="">
      <div className="flex">
        <div className="w-1/2 pr-4">
        <fieldset className="mb-[15px] items-center gap-5">
          <InputLabel label="Model" />
          
          <SingleSelect 
            options={modelOptions} 
            placeholder='Select model' 
            initialValue={localData.model}
            onChange={handleModelChange} 
          />
        </fieldset>
        </div>
        <div className="w-1/2 pt-2">
          <div>
            <fieldset className='flex items-center gap-5'>
            <div className="w-1/4">
              <InputLabel label="Temperature" />
            </div>
            <div className="w-3/4">
              <MainSlider 
                min={0} 
                max={modelOptions.find((m: any) => m.value === localData.model)?.max_temperature} 
                step={0.01}
                initialValue={localData.temperature}
                onChange={(value) => handleSliderChange({field: 'temperature', value: value})} 
              />
            </div>
            </fieldset>
          </div>
          <div>
            <fieldset className='flex items-center gap-5'>
            <div className="w-1/4">
              <InputLabel label="Tokens" />
            </div>
            <div className="w-3/4">
              <MainSlider 
                min={0} 
                max={modelOptions.find((m: any) => m.value === localData.model)?.max_tokens} 
                step={1}
                initialValue={localData.tokens}
                onChange={(value) => handleSliderChange({field: 'tokens', value: value})} 
              />
            </div>
            </fieldset>
          </div>
        </div>
      </div>
      <div className="mt-2">
        <div className="flex items-center gap-5">
          <div className="w-auto">
            <h3 className='text-sm font-light mb-2 text-slate-300'>System Message</h3>
          </div>
          <div className="w-1/2">
            <div className="flex">
              <Switch 
                className='mb-2'
                checked={localData.showSystemMessage}
                onCheckedChange={handleSystemMessageToggle}
              />
            </div>
          </div>
        </div>
        {localData.showSystemMessage && (
          <div className="bg-zinc-900 shadow-md h-auto min-h-[150px] outline-none border-solid border-zinc-600 border rounded-md w-full h-24 bg-zinc-900 text-white text-sm font-light p-4 block focus:ring-transparent hover:border-zinc-600 transition-all">        
            <textarea 
              rows={5}
              className="bg-zinc-900 resize-none h-auto outline-none w-full  text-white text-sm font-light p-2 block focus:ring-transparent focus:border-indigo-600 hover:border-zinc-600 transition-all"
              placeholder="You are a(n) [xxx] expert..."
              name="systemMessage"
              value={localData.systemMessage}
              onChange={(e: any) => handleSystemMessageChange(e)}
              required={localData.showSystemMessage}
            />
          </div>
        )}
        
      </div>
      <div className="mt-2">
        <h3 className='text-sm font-light mb-2 text-slate-300'>Prompt</h3>
        <div className="bg-zinc-900 shadow-md h-auto min-h-[150px] outline-none border-solid border-zinc-600 border rounded-md w-full text-white text-sm font-light p-4 block focus:ring-transparent hover:border-zinc-600 transition-all">
        
          <MentionsInput
            value={prompt}
            onChange={handlePromptChange}
            className="mentions"
            classNames={mentionsClass}
            placeholder="Enter prompt here. Type '{' for a list of data)..."
          >
            <Mention
              trigger="{"
              className={mentionsClass.mentions__mention}
              data={data}
              onAdd={handleOnAdd}          
            />
          </MentionsInput>
        </div>

        <DataDialog 
          addData={handleAddData} 
          noButton={true} 
          open={openNewPrompt} 
          setClose={() => setOpenNewPrompt(false)}
          />
        
      </div>
    </div>
  );
};

export default PromptStep;