import React, { useCallback, useState, useEffect } from 'react';
import Layout from '@/components/layout';
import DataRow from '@/components/data/dataRow';
import DataDialog from '@/components/dialogs/dataDialog';
import { useRouter } from 'next/router';
import ChoiceDialog from '@/components/dialogs/choiceDialog';
import InfoDialog from '@/components/dialogs/infoDialog';
import { toast } from 'react-toastify';
import { useAppStore } from '@/lib/store';
import PageTitle from '@/components/pageTitle';
import MainInput from '@/components/ui/mainInput';
import { GetServerSideProps } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { useAuth } from '@clerk/nextjs';
import authedFetch from '@/lib/authedFetch';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId, getToken } = getAuth(ctx.req);
 
	const datasData = await authedFetch('/data', 'GET', null, getToken);
  const sortedInputs = datasData ? datasData.data.sort((a: any, b: any) => a.name.localeCompare(b.name)) : [];

  return { props: { 
    initialData: datasData ? datasData.data : [],
   } };
};

export default function Data({initialData}: any) {
  const [data, setData] = useState<any>(initialData);
  const [infoOpen, setInfoOpen] = useState(false);
  const [idToBeDeleted, setIdToBeDeleted] = useState<any>(false);
  const router = useRouter();
  const { user } = useAppStore();
  const { getToken } = useAuth();
  const [localUser, setLocalUser] = useState<any>(null);

  useEffect(() => {
    setLocalUser(user);
  }, [user]);

  const handleAddData = useCallback(
    async (dataToBeAdded: any) => {
      console.log('adding data', dataToBeAdded);

      const dataData = {
        ...dataToBeAdded,
        marketplace: user?.siteAdmin ? true : false,
      }

			const createdData = await authedFetch('/data', 'POST', dataData, getToken);
      console.log('createdData: ', createdData);

      const newData = [...data, createdData];
      setData(newData);

      toast.success("Data "+createdData.name+" added successfully", {
        autoClose: 2000,
        theme: 'dark'
      });

      router.push('/library/data/'+createdData._id);
    },
    [data, getToken, router, user?.siteAdmin]
  );

  const handleDeleteData = async () => {
    console.log('deleting data', idToBeDeleted);

    if(data.find((d: any) => d._id === idToBeDeleted).commands.length > 0) {
      setInfoOpen(true);
      return;
    }

		const deleteData = async () => {

			const deletedData = await authedFetch(`/data/${idToBeDeleted}`, 'DELETE', null, getToken);
      console.log('deletedData:', deletedData);
  
      const newData = data.filter((d: any) => d._id !== deletedData._id);
      const removedData = data.find((d: any) => d._id === deletedData._id);
  
      setData(newData);
  
      setIdToBeDeleted(null);

      return removedData;
    }

    const successToast = ({data}: any) => {
			return (
			<div className="flex items-center">
				<div className="w-48">
					<p className="text-sm font-medium text-white-800">
            {"Data "+data.name+" removed successfully"}
          </p>
				</div>
			</div>
		)}

		toast.promise(
			deleteData,
			{
				pending: 'Deleting your data...',
				success: {
					render({data}){
						return successToast({data})
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
  };

  const handleEditRoute = (id: any) => {
    router.push('/library/data/'+id);
  }

  const setSearch = (search: string) => {
    const newData = initialData.filter((d: any) => d.name.toLowerCase().includes(search.toLowerCase()));
    setData(newData);
  }

  const handleSetIdToBeDeleted = (data: any) => {
    console.log('idtobedeleted data: ', data);
    setIdToBeDeleted(data);
  }
      
  return (
    <Layout>
      <main className="w-3/4 md:w-4/5 lg:w-5/6 bg-zinc-950" onClick={() => console.log('test')}>
        <div className="ml-0 px-6 py-2">
          <div className='ml-6'>
            <div className="flex">
              <div className='flex flex-row items-center'>
                <PageTitle title="Data"/>
              </div>
              <div className="flex flex-grow justify-end p-4 mr-2 space-x-2">
                <div className='mr-10'>
                  <MainInput
                    label=""
                    placeholder="Search"
                    onChange={(e) => setSearch(e.target.value)}
                    className='mr-10'
                  />
                </div>
                {localUser?.admin &&
                  <DataDialog addData={handleAddData}/>                   
                }
              </div>
            </div>
          </div>
          <div className="py-4">
            {data.length === 0 ?
              <div>No Data</div>
              :
              <div className="grid grid-cols-2 gap-4 px-6 mb-6">
                {data.map((d: any, key: number) => (
                  <div key={key}>
                    <DataRow 
                      dataName={d.name} 
                      dataUsage={d.commands ? d.commands.length : 0} 
                      id={d._id} 
                      onDelete={handleSetIdToBeDeleted}
                      handleEditRoute={handleEditRoute}
                    />
                  </div>
                ))}
              </div>
            }
            
          </div>          
        </div>
        <InfoDialog
          description="Please remove this data from all commands before deleting."
          open={infoOpen}
          handleClose={() => setInfoOpen(false)}
        />
        <ChoiceDialog
          description="Are you sure you want to delete this data?"
          open={idToBeDeleted}
          handleConfirm={handleDeleteData}
          handleClose={() => setIdToBeDeleted(false)}
        />
      </main>
    </Layout>
  );
}