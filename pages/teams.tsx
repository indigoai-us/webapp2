import Layout from '@/components/layout';
import { UsersIcon } from 'lucide-react';
import Team from '@/components/teams/team';
import TeamDialog from '@/components/dialogs/teamDialog';
import PageTitle from '@/components/pageTitle';
import { useState } from 'react';
import Icon from '@/components/ui/icon';
import MainButton from '@/components/ui/mainButton';
import TeamsEmpty from '@/components/empty-state/teamsEmpty';
import CommandsEmpty from '@/components/empty-state/commandsEmpty';
import CommandCard from '@/components/commands/commandCard';
import { GetServerSideProps } from "next";
import { getAuth } from "@clerk/nextjs/server";
import useFetch from '@/lib/useFetch';
import { useAuth } from "@clerk/nextjs";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId, getToken } = getAuth(ctx.req);
 
	const userData = await useFetch(`/users?sub=${userId}`, 'GET', null, getToken);
  
  const userAdmin = userData?.data[0]?.admin;
    
  if(!userAdmin) {
    throw new Error('Unauthorized');
  }

	const companyId = userData?.data[0]?.company?._id;

	const companyData = companyId ? await useFetch('/companies/'+companyId, 'GET', null, getToken) : null;
	
	const teamsData = await useFetch('/teams', 'GET', null, getToken);
  
  return { props: { 
    sub: userId,
    company: companyData ? companyData.data : {},
    teamsData: teamsData ? teamsData.data : [],
    userAdmin
   } };
};

export default function Teams({company, sub, teamsData, userAdmin}: any) {
  const sortedTeamsData = [...teamsData].sort((a: any, b: any) => a.name.localeCompare(b.name));
  const { getToken } = useAuth();

  const [teams, setTeams] = useState<any>(sortedTeamsData);    
  const [selectedTeam, setSelectedTeam] = useState<any>(null);

  const submitNewTeam = async (data: any) => {
    
    const userIds = data.users.map((user: any) => user.value);

    const createdByUser = company.users.filter((user: any) => user.sub === sub)[0];
    
    const newTeam = {
      name: data.name,
      company: company._id,
      users: userIds,
      createdBy: createdByUser._id,
      icon: data.icon
    }

    const createdTeam = await useFetch('/teams', 'POST', newTeam, getToken);
    
    setTeams([...teams, createdTeam]);
    setSelectedTeam(null);

  }

  const saveExistingTeam = async (data: any) => {

    const userIds = data.users.map((user: any) => user.value);
    const newData = {
      ...data,
      users: userIds
    }

    const updatedTeam = await useFetch(`/teams/${data._id}`, 'PUT', newData, getToken);

    const updatedMembers = teams.map((team: any) => {
      if(team._id === updatedTeam._id) {
        return updatedTeam;
      } else {
        return team;
      }
    });

    setTeams(updatedMembers);
    setSelectedTeam(null);

  }

  const handleEdit = (data: any) => {
    setSelectedTeam(data);
  }
  
  const handleDelete = async (data: any) => {
    console.log('deleting team: ', data._id);
    
  }
  
  return (
    <Layout>
      <main className="w-3/4 md:w-4/5 lg:w-5/6 transition-all bg-zinc-900">
        <div className="container mx-auto px-20 py-4">
          <div className="ml-0 divide-y divide-solid divide-zinc-800">
            <PageTitle title="Teams"/>
              <div className='py-4 '>
                <div className='flex'>
                  <div className='flex flex-grow'>
                    <h2>Manage Teams</h2>              
                  </div>
                  <div className='flex flex-none justify-end'>
                    <MainButton textSize='text-sm' onClick={() => setSelectedTeam('new')}>Add Team</MainButton>
                    <TeamDialog 
                      members={company?.users} 
                      submitNewTeam={submitNewTeam}
                      saveExistingTeam={saveExistingTeam}
                      selectedTeam={selectedTeam} 
                      handleClose={() => setSelectedTeam(null)}
                      deleteMember={handleDelete}
                      deleteTeam={handleDelete}
                    />
                  </div>
                </div>
                  {teams.length === 0 ?
                    <TeamsEmpty />
                    :
                    <div className='flex flex-col divide-y divide-solid divide-zinc-800 mt-4'>
                      {teams.map((team: any) => {
                        return (
                          <div className='flex mb-2 pt-2'>
                            <Team 
                              name={team.icon ? team.icon : 'Users'} 
                              teamName={team.name} 
                              numMembers={team.users.length}
                              handleEdit={handleEdit}
                              data={team}
                            />
                          </div>
                        )
                      })}                
                    </div>
                  }          
            </div>             
          </div>
        </div>

      </main>
    </Layout>
  );
}