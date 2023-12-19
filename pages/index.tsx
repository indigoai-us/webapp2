import Layout from '@/components/layout';
import { getAuth } from "@clerk/nextjs/server";
import { GetServerSideProps } from "next";
// import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from 'react';
import PageTitle from '@/components/pageTitle';
import MainButton from '@/components/ui/mainButton';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { PlusIcon } from '@heroicons/react/20/solid';
import CommandsEmpty from '@/components/empty-state/commandsEmpty';
import CommandCard from '@/components/commands/commandCard';
import useFetch from '@/lib/useFetch';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId, getToken } = getAuth(ctx.req);
 
  const gotCompanies = await useFetch('/companies', 'GET', null, getToken);
  console.log('got companies:', gotCompanies);  

  const gotCommands = await useFetch('/commands', 'GET', null, getToken);
  console.log('got commands:', gotCommands);  
  
  return { props: { companies: gotCompanies.data, commands: gotCommands.data } };
};

export default function Home(props: any) {
  const { companies, commands } = props;
  // const { getToken } = useAuth();
  const { user } = useAppStore()
  const [localUser, setLocalUser] = useState<any>(null);
  const [localCommands, setLocalCommands] = useState<any>(null);

  useEffect(() => {
    setLocalUser(user);
  }, [user])

  useEffect(() => {
    setLocalCommands(commands);
  }, [commands])

  // const getCompanies = async () => {
  //   const getResponse = await fetch(`http://localhost:8080/companies`, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${await getToken()}`
  //     }
  //   });
  //   const gotData = await getResponse.json();
  //   console.log('client side got companies:', gotData);  
  // }

  useEffect(() => {
    console.log('companies: ', companies);
    console.log('commands: ', commands);
    // getCompanies();    
  }, [companies, commands])

  return (
    <Layout>
      <main className="w-3/4 md:w-4/5 lg:w-5/6 bg-zinc-950">
          
        <div className="ml-0 px-6 py-2">
          <div className='ml-6'>
            <div className="flex items-center">
              <div>
                <PageTitle title="Commands"/>
              </div>
              <div className="flex flex-grow justify-end p-4 mr-2 space-x-2">
                {/* {user?.admin &&
                  <Link href="/marketplace">
                    <MainButton color='grey' textSize='text-sm'  href="/marketplace" icon={<img src="/gem-100.png" width={"15px"} alt="Icon" />}>
                      Import from Marketplace
                    </MainButton>
                  </Link>
                } */}
                {localUser?.admin &&
                  <Link href="/library/command/new">
                    <MainButton textSize='text-sm' icon={ <PlusIcon className="w-5 group-hover:w-7 group-hover:transition-all" />}>
                        New Command
                    </MainButton>
                  </Link>                    
                }
              </div>
            </div>
            {/* <div className="flex relative bottom-2">
              <div className="cursor-pointer">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ChatBubbleLeftRightIcon className="text-orange-300 w-5 h-5"/>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Assistant Command</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="ml-2 cursor-pointer">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ClipboardDocumentIcon className="text-green-200 w-5 h-5" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Uses Clipboard</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="ml-2 cursor-pointer">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <EyeIcon className="text-indigo-100 w-5 h-5" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Vision Command</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div> */}

          </div>
          <div className="py-4">

            {localCommands?.length === 0 ?
              <CommandsEmpty />
              :
              <div className="grid grid-cols-3 gap-4 px-6 mb-6">
                {localCommands?.map((command: any, key: number) => (
                  <CommandCard 
                    key={key}
                    command={command}
                    userAdmin={user?.admin}
                  />
                ))}
              </div>
            }
          
          </div>
          
        </div>
      </main>
    </Layout>
  )
}
