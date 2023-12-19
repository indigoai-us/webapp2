import React, { useCallback, useState, useEffect } from 'react';
import Layout from '@/components/layout';
import { Switch } from "@/components/ui/switch"
import InputLabel from '@/components/ui/inputLabel';
import MainButton from '@/components/ui/mainButton';
import Textarea from '@/components/ui/textarea';
import EditableInput from '@/components/elements/editableInput';
import { useRouter } from 'next/router';
import { useAuth } from '@clerk/nextjs';
import useFetch from '@/lib/useFetch';

const dataOptions = [
  { value: 'input1', label: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  // ... add more options as needed
];

const defaultData = {
  options: dataOptions,
  name: 'Data Name',
  optionsLocked: false,
  personal: false,
}

export default function DataDetail() {
  const [options, setOptions] = useState(null);
  const [inProgress, setInProgress] = useState(false);
  const [data, setData] = useState(defaultData);
  const [editingName, setEditingName] = useState(false);
  const [newValue, setNewValue] = useState('');
  const router = useRouter();
  const id = router.query.id;
  const { getToken } = useAuth();

  useEffect(() => {
    console.log('id', id);

    const getData = async () => {
      // Fetch data from server

			const results = await useFetch(`/data/${id}`, 'GET', null, getToken);

      setData(results);
    }

    id && getData();
  },[id]);

  const submitData = useCallback(
    async () => {

      setInProgress(true);

      try {

        console.log('submitting data');
        
        setInProgress(false);
      } catch (error) {
        console.error(error);
      } finally {
        setInProgress(false);
      }
    },
    [options]
  );

  const handleAddOption = useCallback(
    async () => {
      console.log('Add button clicked.');

      const newDataValue = {
        value: newValue
      }

			const responseData = await useFetch(`/datavalues`, 'POST', newDataValue, getToken);

      console.log('responseData:', responseData);

      const optionIds = data.options.map((option: any) => option._id);

      const newData = {
        ...data,
        options: [...optionIds, responseData._id]
      };

      await handleUpdateData(newData);
      setNewValue('');

    },
    [data, newValue]
  );

  const handleUpdateOption = useCallback(
    async (index: number, text: string, option: object) => {
      
      const newDataValue = {
        ...option,
        value: text
      }

      const response = await fetch(`/api/datavalues/put`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newDataValue)
      });
      const responseData = await response.json();

      const newOptions = data.options.map((option, i) => {
        if (i === index) {
          return { ...option, value: text };
        }
        return option;
      });

      console.log('newOptions', newOptions);
      const optionIds = newOptions.map((option: any) => option._id);
      
      const newInput = {
        ...data,
        options: optionIds
      };

      await handleUpdateData(newInput);

    },
    [data]
  );

  const handleRemoveOption = useCallback(
    async (index: number) => {
      
      const optionToRemove = data.options[index];

      // Make sure optionToRemove has an _id property
      const optionId = '_id' in optionToRemove ? optionToRemove._id : '';

			const deletedOption = await useFetch(`/datavalues/${optionId}`, 'DELETE', null, getToken);

      const newOptions = data.options.filter((option, i) => i !== index);

      console.log('newOptions', newOptions);      

      const optionIds = newOptions.map((option: any) => option._id);

      const newInput = {
        ...data,
        options: optionIds
      };

      await handleUpdateData(newInput);
      
    },
    [data]
  );

  const handleUpdateName = (index: number, text: string) => {
    const optionIds = data.options.map((option: any) => option._id);
    const newData = {
      ...data,
      options: optionIds,
      name: text
    };

    handleUpdateData(newData);

  }

  const handleUpdateLocked = () => {
    console.log('handleUpdateLocked');
    const optionIds = data.options.map((option: any) => option._id);
    const newData = {
      ...data,
      options: optionIds,
      optionsLocked: !data.optionsLocked
    };

    handleUpdateData(newData);

  }

  const handleUpdatePersonal = () => {
    console.log('handleUpdatePersonal');
    const optionIds = data.options.map((option: any) => option._id);
    const newData = {
      ...data,
      options: optionIds,
      personal: !data.personal,
    };

    handleUpdateData(newData);

  }

  const handleUpdateData = useCallback(
    async (newData: any) => {
      console.log('Update data.', newData);

			const response = await useFetch(`/data/${newData._id}`, 'PUT', newData, getToken);
      console.log('handleUpdateInput response:', response);

      setData(response);
    },
    [data]
  );
  

  return (
    <Layout>
      <main className="w-3/4 md:w-4/5 lg:w-5/6 bg-zinc-900">
        {/* -------EDIT Input------- */}
        <div>
          <div className="py-4 divide-y divide-solid divide-zinc-800">
            <div className='pb-4 px-4'>
              <h2 className="text-md" style={{display: 'flex', alignItems: 'center'}}>
                {"Global > "}
                <span style={{marginLeft: 5, position: 'relative', bottom: 3}}>
                  <EditableInput
                    initialInput={data.name} 
                    onUpdate={handleUpdateName}
                    index={0}
                    option={{placeholder: 'Input Name'}}                
                  /> 
                </span>
              </h2>
            </div>
            <div className='py-4 px-4'>
              {/* Input preset values list with rollover delete button */}
              {
                data.options.map((option, index) => (
                  <EditableInput
                    initialInput={option.value} 
                    key={index}
                    index={index} 
                    option={option}
                    onUpdate={handleUpdateOption} 
                    onRemove={handleRemoveOption}
                  />
                ))
              }
            </div>
            <div className='mx-4  divide-y divide-solid divide-zinc-800'>                
              <div className='pt-4'>
                <InputLabel label="Add Data Value" />
                <Textarea placeholder="Insert data value..." onChange={(e) => setNewValue(e.target.value)} value={newValue} />
                <MainButton textSize='text-sm' onClick={handleAddOption}>Add Data Value</MainButton>
              </div>
            </div>
            
          </div>
            
        </div>
      </main>

      {/* -------SETTINGS------- */}

      <aside className="w-1/3 lg:w-1/4 transition-all bg-zinc-900 border-l border-solid border-zinc-800 py-4 px-4">
        <h4>Settings</h4>
        
        <div className="py-4 flex">
          <div className="flex flex-none mr-6 w-1/2">
            <h5 className='text-xs text-slate-500'>Members can edit?</h5>
          </div>
          <div className="flex flex-none flex-col">
            <div className='flex mb-2'>
              <Switch checked={data.optionsLocked} onCheckedChange={handleUpdateLocked}/>                    
            </div>
          </div>
        </div>

        <div className="py-4 flex">
          <div className="flex flex-none mr-6 w-1/2">
            <h5 className='text-xs text-slate-500'>Personal</h5>
          </div>
          <div className="flex flex-none flex-col">
            <div className='flex mb-2'>
              <Switch checked={data.personal} onCheckedChange={handleUpdatePersonal}/>                    
            </div>
          </div>
        </div>

      </aside>
    </Layout>
  )
}