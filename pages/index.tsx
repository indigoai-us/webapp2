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
import authedFetch from '@/lib/authedFetch';
import { GridIcon, LayoutGridIcon, LayoutPanelTop, ToyBrickIcon } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId, getToken } = getAuth(ctx.req);
 
  const gotCompanies = await authedFetch('/companies', 'GET', null, getToken);
  console.log('got companies:', gotCompanies.data.length);  

  let commands = [];
  const gotCommands = await authedFetch('/commands', 'GET', null, getToken);
  if(gotCommands.code !== 500) {
    commands = gotCommands.data;
  }
  console.log('got commands:', gotCommands.data.length);  
  
  return { props: { companies: gotCompanies.data, commands } };
};

export default function Home(props: any) {
  const { companies, commands } = props;
  // const { getToken } = useAuth();
  const { user, updateUser } = useAppStore()
  const [localUser, setLocalUser] = useState<any>(null);
  const [localCommands, setLocalCommands] = useState<any>([]);
  const [layoutStyle, setLayoutStyle] = useState<any>('grid');
  const {getToken} = useAuth();

  useEffect(() => {
    setLocalUser(user);
    if(commands.length===0) {
      const getCommands = async () => {
        const clientSideCommands = await authedFetch(`/commands`, 'GET', null, getToken);
        console.log('client side commands: ', clientSideCommands);
        if(clientSideCommands?.data?.length > 0) {
          setLocalCommands(clientSideCommands.data);
        } else {
          console.log('no commands found');          
        }
      }
      getCommands();
    }
  }, [user])

  useEffect(() => {
    console.log('commands: ', commands);
    
    setLocalCommands(commands);
  }, [commands])

  // const handleLayoutStyle = async (style: string) => {
  //   updateUser({...user, layoutStyle: style})
  // }

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

  return (
    <Layout>
      <main className="w-3/4 md:w-4/5 lg:w-5/6 bg-zinc-950">
          
        <div className="ml-0 px-6 py-2">
          <div className='ml-6'>
            <div className="flex items-center">
              <div>
                <PageTitle title="Commands"/>
              </div>
              <div className="flex flex-grow justify-end p-4 mr-2 space-x-2 items-center">
                {/* {user?.admin &&
                  <Link href="/marketplace">
                    <MainButton color='grey' textSize='text-sm'  href="/marketplace" icon={<img src="/gem-100.png" width={"15px"} alt="Icon" />}>
                      Import from Marketplace
                    </MainButton>
                  </Link>
                } */}
                {/* {layoutStyle === 'masonry' ?
                  <LayoutGridIcon 
                    className={`w-8 h-8 cursor-pointer text-indigo-100 mr-4`} 
                    onClick={() => handleLayoutStyle('grid')}
                    />
                  :
                  <LayoutPanelTop
                    className={`w-8 h-8 cursor-pointer text-indigo-100 mr-4`} 
                    onClick={() => handleLayoutStyle('masonry')}
                    />
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
              <>
                {layoutStyle === 'grid' ?
                  <div className="grid grid-cols-3 gap-4 px-6 mb-6">
                    {localCommands?.map((command: any, key: number) => (
                      <CommandCard 
                        key={key}
                        command={command}
                        userAdmin={user?.admin}
                      />
                    ))}
                  </div>
                  :
                  <div className="grid grid-flow-row-dense grid-cols-12 gap-4">
                    {localCommands?.map((command: any, key: number) => {
                      return (
                        <div className={`${(key>3 && key<7) ? 'col-span-4' : 'col-span-3'}`}>
                          <div className={`h-56`}>
                            <CommandCard 
                              key={key}
                              command={command}
                              userAdmin={user?.admin}
                              tile={true}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                }
              </>
            }
          
          </div>
          
        </div>
      </main>
    </Layout>
  )
}
