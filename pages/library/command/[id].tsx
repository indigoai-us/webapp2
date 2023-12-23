import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout';
import * as Avatar from '@radix-ui/react-avatar';
import { Switch } from "@/components/ui/switch"
import PromptStep from '@/components/commands/prompt';
import MainButton from '@/components/ui/mainButton';
import TextareaGroup from '@/components/ui/textareaGroup';
import { useRouter } from 'next/router';
import AddTeamsDialog from '@/components/dialogs/addTeamsDialog';
import AddUsersDialog from '@/components/dialogs/addUsersDialog';
import Icon from '@/components/ui/icon';
import MainInput from '@/components/ui/mainInput';
import { toast } from 'react-toastify';
import ChoiceDialog from '@/components/dialogs/choiceDialog';
import { getAuth } from "@clerk/nextjs/server";
import { GetServerSideProps } from "next";
import { useAuth } from "@clerk/nextjs";
import authedFetch from '@/lib/authedFetch';

const emptyCommand = {
	id: '',
	name: 'Command Name',
	description: '',
	promptFrame: '',
	rawPromptFrame: '',
	systemMessage: '',
	temperature: .5,
	tokens: 2000,
	model: '',
	status: true,
	teams: [],
	users: [],
	assistant: false,
	showSystemMessage: true
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const { userId, getToken } = getAuth(ctx.req);
	
	const userData = await authedFetch(`/users?sub=${userId}`, 'GET', null, getToken);
  
	const orgAdmin = userData?.data[0]?.admin;
	const companyId = userData?.data[0]?.company?._id;

	const companyData = companyId ? await authedFetch('/companies/'+companyId, 'GET', null, getToken) : null;
	
	const dataData = await authedFetch('/data', 'GET', null, getToken);

	const teamsData = await authedFetch('/teams', 'GET', null, getToken);

	const { id } = ctx.query;

	const commandData = id === 'new' ? emptyCommand : await authedFetch('/commands/'+id, 'GET', null, getToken);

	const modelsData = await authedFetch('/models', 'GET', null, getToken);

	return { props: { 
		user: userData ? userData.data[0] : {},
		data: dataData ? dataData.data : [],
		teams: teamsData ? teamsData.data : [],
		company: companyData ? companyData.data : {},
		commandData: commandData ? commandData : {},
		models: modelsData ? modelsData.data : [],
		orgAdmin: orgAdmin ? true : false
	 } };
};

export default function EditCommand({user, data, teams, company, commandData, models, orgAdmin}: any) {
	const router = useRouter();
	const id = router.query.id;
	const [command, setCommand] = useState(commandData);
	const [error, setError] = useState<any>(null);
	const [confirmOpen, setConfirmOpen] = useState(false);
  	const { getToken } = useAuth();

	const handleUpdateCommand = (update: {field: string; value: any}) => {
	
		const newCommand = {
			...command,
			[update.field]: update.value,
		}

		setCommand(newCommand);

  }

	const handleUpdatePromptData = (data: any) => {		
		setCommand({
			...command,
			...data
		});
	}

	const handleSaveCommand = async (e: any) => {
    	e.preventDefault();

		console.log('saving command', command);
		
		setError(null);

		const selectedModel = models.find((m: any) => m._id === command.model);

		if(command.assistant && selectedModel.nameCode === 'gpt-4-vision-preview') {
			toast.error("Vision models cannot be used as an assistant", {
				autoClose: 2000,
				theme: 'dark'
			});
			return;
		}

		if(id === 'new') {

			// const newCommand = user.siteAdmin ? {
			// 	...command,
			// 	createdBy: user._id,
			// 	marketplace: true
			// } : {
			// 	...command,
			// 	createdBy: user._id,
			// 	company: user.company._id,
			// 	users: [user._id],
			// }

			const newCommand = {
				...command,
				createdBy: user._id,
				company: user.company._id,
				users: [user._id],
			}

			const createdCommand = await authedFetch('/commands', 'POST', newCommand, getToken);

			console.log('createdCommand: ', createdCommand);
			
			router.push('/');

		} else {

			const putCommand = await authedFetch('/commands/'+id, 'PATCH', command, getToken);

			router.push('/');

		}
	};

	const submitNewTeams = async (teams: any) => {
		const newTeams = teams.map((team: any) => team.value)
		setCommand({...command, teams: newTeams});
	}

	const submitNewUsers = async (users: any) => {
		const newUsers = users.map((user: any) => user.value)
		setCommand({...command, users: newUsers});
	}
		
	const handleDelete =async () => {
		
		const deletedCommand = await authedFetch('/commands/'+id, 'DELETE', null, getToken);

		toast.success("Command successfully deleted", {
			autoClose: 2000,
			theme: 'dark'
		});

		router.push('/');

	}

  return (
    <Layout>
      <main className="w-3/4 md:w-4/5 lg:w-5/6 bg-zinc-900">
        {/* -------EDIT COMMAND------- */}
			<div>
				<div className="py-2 px-10 divide-y border-b border-b-solid border-b-zinc-800">
						<div className='py-4 px-4'>
								<h2 className="text-md"><Link href="/commands">Command Library</Link> {"> "} 
									<span className="text-sm text-slate-500">
										{id === 'new' ? 'New Command' : command.vanityId}
									</span>
								</h2>
						</div>
				</div>
				<form onSubmit={handleSaveCommand}>
					<div className="pb-2 px-10 divide-y divide-solid divide-zinc-800">
						<div className='py-4 px-4'>
							{/* <EditableTitle initialTitle={command.name} handleUpdate={handleUpdateCommand} /> */}
							<MainInput
								label="Name"
								value={command.name}
								name="name"
								onChange={(e) => setCommand({...command, [e.target.name]: e.target.value})}
								required
							/>
						</div>
						<div className='py-4 px-4'>
								<h3 className='text-sm text-slate-300'>Description</h3>
								<TextareaGroup 
									textareaPlaceholder="Enter description here..." 
									labelText=''
									initialValue={command.description}
									onChange={(e) => handleUpdateCommand({field: 'description', value: e.target.value})}
								/>
						</div>
						<div className='mx-4  divide-y divide-solid divide-zinc-800'>
							<div className='pt-4'>
								<h3 className='text-sm text-slate-3	00'>Prompt</h3>
								<div className='py-4'>
									<div className='rounded-md p-4 bg-zinc-800'>
										<PromptStep 
											updatePromptData={handleUpdatePromptData} 
											initialData={command} 
											dataData={data} 
											models={models}
										/>
									</div>
								</div>											
							</div>
						</div>
						{error &&
							<div className='flex flex-row justify-end mr-4 text-red-500'>
								{error}
							</div>						
						}
						<div className='flex flex-row '>
							{/* <div className='flex flex-grow py-4 px-4'>
								<div className='w-3/4'>
								<h3 className='mb-2'>History</h3>
									<HistoryItem timestamp='1/1/2021 12:00pm' onRevert={() => console.log('Revert clicked')}/>
									<HistoryItem timestamp='1/1/2021 12:00pm' onRevert={() => console.log('Revert clicked')}/>
									<HistoryItem timestamp='1/1/2021 12:00pm' onRevert={() => console.log('Revert clicked')}/>
									<HistoryItem timestamp='1/1/2021 12:00pm' onRevert={() => console.log('Revert clicked')}/>
									<HistoryItem timestamp='1/1/2021 12:00pm' onRevert={() => console.log('Revert clicked')}/>
								</div>
							</div> */}
							<div className="mx-4 mb-20 h-14 justify-end flex pt-4 ">
								<div className='flex-col flex divide-y divide-solid divide-zinc-800'>
									<div className='mt-8'>
										<MainButton textSize='text-sm' type="submit">Save Command</MainButton>
										<MainButton 
											textSize='text-xs' 
											color='grey'
											className='bg-zinc-800 ml-2 hover:bg-zinc-700 hover:border-zinc-500 border-zinc-800 ' 
											type="button"
											onClick={() => setConfirmOpen(true)}
										>
											Delete Command
										</MainButton>
									</div>
								</div>
							</div>
						</div>
					</div>
				</form>

				<ChoiceDialog
					description="Are you sure you want to delete this command?"
					open={confirmOpen}
					handleConfirm={handleDelete}
					handleClose={() => setConfirmOpen(false)}
				/>

			</div>
      </main>

      {/* -------SETTINGS------- */}

        <aside className="w-1/3 lg:w-1/4 transition-all bg-zinc-900 border-l border-solid border-zinc-800 py-4 px-4">
           <h4>Settings</h4>
           <div className="py-4 flex">
                <div className="flex flex-none mr-6 w-12">
                    <h5 className='text-xs text-slate-500'>Teams</h5>
                </div>
                <div className="flex flex-none flex-col">
									{command.teams?.map((team: any, i: number) => {
										const teamData = teams.find((t: any) => t._id === team);
										return (
											<div className='flex mb-2' key={i}>
												<div><Icon name={teamData.icon ? teamData.icon : 'Megaphone'} size={14}/></div>
												<div className="text-xs text-white ml-3">{teamData.name}</div>
											</div>
										)
									})}

									<AddTeamsDialog teams={teams} submitNewTeams={submitNewTeams} initialTeams={command.teams}/>
                    
            
                </div>
           </div>
           <div className="py-4 flex">
                <div className="flex flex-none mr-6 w-12">
                    <h5 className='text-xs text-slate-500'>Members</h5>
                </div>
                <div className="flex flex-none flex-col">

									{command.users?.map((user: any) => {
										const userData = company.users.find((u: any) => u._id === user);
										return userData ? (
											<div className='flex mb-2'>
											<div className='w-4 h-4 mr-3 relative'>
											<Avatar.Root className="AvatarRoot absolute -mt-1.5 -ml-1 ">
												<Avatar.Image
														className="AvatarImage w-4 rounded-full"
														src="/logo2.jpg"
														alt="Colm Tuite"
												/>
												<Avatar.Fallback className="AvatarFallback text-xs bg-slate-700 rounded-full p-1" delayMs={600}>
														{userData?.first_name ? userData.first_name[0] + userData.last_name[0] : '??'}
												</Avatar.Fallback>
											</Avatar.Root>    
											</div>
											<div className="text-xs text-white">
												{userData?.first_name ? `${userData.first_name} ${userData.last_name}` : userData?.email}
											</div>
										</div>
										) : null;
									})}
										
										<AddUsersDialog users={company.users} submitNewUsers={submitNewUsers} initialUsers={command.users}/>
                    
                </div>
           </div>
           {/* <div className="py-4 flex">
                <div className="flex flex-none mr-6 w-12">
                    <h5 className='text-xs text-slate-500'>Folder</h5>
                </div>
                <div className="flex flex-none flex-col">
                    <div className='flex mb-2'>
                    <div><BoltIcon className='w-4 h-4 mr-3'></BoltIcon></div>
                    <div className="text-xs text-white">Productivity</div>
                    </div>
                    <div className='flex hidden'>
                    <div><PlusIcon className='w-4 h-4 mr-3'></PlusIcon></div>
                    <div className="text-xs text-slate-500">Add Team</div>
                    </div>
                    
                 
                </div>
           </div> */}
           <div className="py-4 flex">
                <div className="flex flex-none mr-6 w-12">
                    <h5 className='text-xs text-slate-500'>Assistant</h5>
                </div>
                <div className="flex flex-none flex-col">
                    <div className='flex mb-2'>
	                    <Switch 
							checked={command.assistant} 
							onCheckedChange={(e) => handleUpdateCommand({field: 'assistant', value: !command.assistant})}
							/>                    
                    </div>
                </div>
           </div>
		   <div className="py-4 flex">
                <div className="flex flex-none mr-6 w-12">
                    <h5 className='text-xs text-slate-500'>Status</h5>
                </div>
                <div className="flex flex-none flex-col">
                    <div className='flex mb-2'>
	                    <Switch checked={command.status} onCheckedChange={(e) => handleUpdateCommand({field: 'status', value: !command.status})}/>                    
                    </div>
                </div>
           </div>
        </aside>
    </Layout>
  )
}