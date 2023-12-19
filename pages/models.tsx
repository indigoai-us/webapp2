import { useEffect, useState } from 'react';
import Layout from '@/components/layout';
import { ArrowPathIcon } from '@heroicons/react/20/solid';
import PageTitle from '@/components/pageTitle';
import ModelCard from '@/components/models/modelCard';
import { toast } from 'react-toastify';
import Button from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import MainInput from '@/components/ui/mainInput';
import { useAppStore } from '@/lib/store';
import { GetServerSideProps } from "next";
import { getAuth } from "@clerk/nextjs/server";
import useFetch from '@/lib/useFetch';
import { useAuth } from '@clerk/nextjs';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId, getToken } = getAuth(ctx.req);
 
	const modelsData = await useFetch('/models', 'GET', null, getToken);

  return { props: { 
    initialModels: modelsData ? modelsData.data : [],
  } };
};

export default function Models(
  {initialModels}: any
  ) {
    const [models, setModels] = useState<any>(initialModels.sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name)));
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const { user } = useAppStore();
  const { getToken } = useAuth();

  const handleUpdateModel = async({body, model}: any) => {

    const patchModel = async() => {

			await useFetch(`/models/${model._id}`, 'PATCH', body, getToken);

      const newModel = {
        ...model,
        ...body
      }
      const newModels = models.map((m: any) => {
        return m._id === model._id ? newModel : m;
      })
      setModels(newModels);
      selectedModel && setSelectedModel({...selectedModel, ...body})
    }

    await toast.promise(
			patchModel,
			{
				pending: 'Updating model',
				success: {
					render({data}){
						return 'Sweet, model updated! 🎉'
					},
					autoClose: 2000,
					theme: 'dark',
				},
				error: {
					render({data}){
						return 'On no, something went wrong 🤯'
					},
					autoClose: 2000,
					theme: 'dark'
				}
			}
		);

  }

  const updateSelectedModel = async() => {
    const body = {
      server: selectedModel.server,
      customApiKey: selectedModel.customApiKey,
      apiKey: selectedModel.apiKey
    }
    await handleUpdateModel({body, model: selectedModel});
    setSelectedModel(null);
  }

  const updateGlobalModels = async() => {
    console.log('updating global models');

    const updatedGlobal = await useFetch(`/models/1`, 'PUT', { updateGlobal: true }, getToken);
    console.log('updatedGlobal: ', updatedGlobal);
    
  }

  const handleSetSelectedModel = (modelData: any) => {
    if (modelData.customApiKeyRequired) {
      return;
    }
    if(selectedModel && selectedModel._id === modelData._id) {
      setSelectedModel(null);
    } else {
      setSelectedModel(modelData);
    }
  }

  return (
    <Layout>
      <main className="w-3/4 md:w-4/5 lg:w-5/6 bg-zinc-900 flex">
          
        <div className={`${selectedModel ? "w-3/4 md:w-3/4 lg:w-3/4" : "w-full"} ml-0 divide-y divide-solid divide-zinc-800`}>
          <div className='ml-6'>
            <div className="flex">
                <div className='flex items-center'>
                  <PageTitle title="Models"/>
                  {user?.siteAdmin &&
                    <Button
                      className="mt-2 ml-4 h-10"
                      onClick={updateGlobalModels}
                    >Global Sync</Button>                
                  }
                </div>
                {/* <div className="flex flex-grow justify-end p-4 mr-2">
                    <Link href="/marketplace">
                      <MainButton textSize='text-sm' className='mr-2 bg-zinc-800 hover:bg-zinc-700' href="/marketplace" icon={<img src="/gem-100.png" width={"20px"} alt="Icon" />}>
                        Import from Marketplace
                      </MainButton>
                    </Link>
                    <Link href="/library/command/new">
                      <MainButton textSize='text-sm' icon={ <PlusIcon className="w-5 group-hover:w-7 group-hover:transition-all" />}>
                          New Model
                      </MainButton>
                    </Link>
                </div> */}
            </div>
          </div>
          <div className="py-4">

            <div  className="grid grid-cols-1 gap-4 px-6 mb-6">
              {models.map((model: any, key: number) => (
                <ModelCard 
                  key={key}
                  model={model}
                  handleUpdateModel={handleUpdateModel}
                  selectModel={handleSetSelectedModel}
                />
              ))}
            </div>
          
          </div>
          
        </div>

        {selectedModel &&
          <nav className="w-1/4 md:w-1/4 lg:w-1/4 py-4 pr-2 h-screen transition-all bg-zinc-800 flex-none ">
            <div className="flex-col pl-6 pr-6">

              <div className="mt-2 mb-4" style={{display: 'flex', flexDirection: 'row'}}>
                <img src={selectedModel.icon} className="w-6 h-6 rounded-full" alt="Icon" />
                <h3 className="my-1 text-sm ml-2">{selectedModel.name}</h3>
              </div>

              {/* {selectedModel.serverOptions &&
                <div className='flex-col'>
                  <div className="my-1 text-sm ml-1">Server</div>
                  <SingleSelect
                    options={selectedModel.serverOptions}
                    placeholder="Select server..."
                    initialValue={selectedModel.server}
                    onChange={(value) => setSelectedModel({ ...selectedModel, server: value.value })}
                  />            
                </div>
              } */}

              {!selectedModel.customApiKeyRequired &&
                <div className='flex-row mt-5 mb-4' style={{display: 'flex', alignItems: 'center'}}>
                  <Switch 
                    checked={selectedModel.customApiKey} 
                    onCheckedChange={(e) => setSelectedModel({...selectedModel, customApiKey: !selectedModel.customApiKey})}
                  />
                  <div className="my-1 text-sm ml-3">Custom API Key</div>
                </div>
              }

              {(selectedModel.customApiKeyRequired || selectedModel.customApiKey) &&
                <MainInput
                  label="API Key"
                  value={selectedModel.apiKey}
                  name="apiKey"
                  onChange={(e) => setSelectedModel({...selectedModel, apiKey: e.target.value})}
                />
              }

              <Button
                className="mt-4"
                onClick={updateSelectedModel}
                icon={<ArrowPathIcon className="w-5 group-hover:w-7 group-hover:transition-all" />}
              >
                Update 
              </Button>

            </div>
          </nav>      
        }

      </main>
    </Layout>
  )
}
