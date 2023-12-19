import { useEffect, useState } from 'react';
import Layout from '@/components/layout';
import { UsersIcon } from 'lucide-react';
import Member from '@/components/members/member';
import MemberDialog from '@/components/dialogs/memberDialog';
import { useRouter } from 'next/router';
import MainButton from '@/components/ui/mainButton';
import { toast } from 'react-toastify';
import { GetServerSideProps } from "next";
import { getAuth } from "@clerk/nextjs/server";
import useFetch from '@/lib/useFetch';
import { useAuth, useUser } from '@clerk/nextjs';
import { useOrganization, clerkClient } from '@clerk/nextjs';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const { userId, getToken } = getAuth(ctx.req);
	
	const userData = await useFetch(`/users?sub=${userId}`, 'GET', null, getToken);
  
  const userAdmin = userData?.data[0]?.siteAdmin;
	const orgAdmin = userData?.data[0]?.admin;
	const companyId = userData?.data[0]?.company?._id;

	const companyData = companyId ? await useFetch('/companies/'+companyId, 'GET', null, getToken) : null;
	
	const teamsData = await useFetch('/teams', 'GET', null, getToken);

	return { props: { 
    company: companyData ? companyData.data : {},
    teams: teamsData ? teamsData.data : [],
    userAdmin: userAdmin ? true : false,
    orgAdmin: orgAdmin ? true : false,
    clerkUserId: userId,
	 } };
};

export default function Members({company, teams, userAdmin, orgAdmin, clerkUserId}: any) {
  const [members, setMembers] = useState<any>(company.users);
  const [open, setOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const router = useRouter();
  const { getToken } = useAuth();
  const { organization } = useOrganization();

  const submitNewMember = async (data: any) => {

    console.log('organization: ', organization?.id);
    console.log('clerkUserId: ', clerkUserId);
    
    if(!organization?.id) {
      toast.error("No organization found", {
        autoClose: 2000,
        theme: 'dark'
      });
      return;
    }

    const invitedUser = await fetch('/api/users/inviteMember', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        organizationId: organization?.id, 
        emailAddress: data.email,
        inviterUserId: clerkUserId, 
        role: data.admin ? 'admin' : 'basic_member', 
        redirectUrl: "http://localhost:3000/invite-accepted" 
      })
    });

    // const newTeams = data.teams.map((team: any) => team.value);
    
    // const newUser = {
    //   email: data.email,
    //   teams: newTeams,
    //   company: company._id,
    //   adminCreateUser: true,
    //   admin: data.admin,
    // }
    
    // const createdMember = await useFetch(`/users`, 'POST', newUser, getToken);

    // const companyUserIds = company.users.map((user: any) => user._id);
    // const createdMemberId = createdMember._id;

    // const newCompany = {
    //   ...company,
    //   users: [
    //     ...companyUserIds,
    //     createdMemberId
    //   ]
    // }

    // delete newCompany._id;    

    // const updatedCompany = await useFetch(`/companies/${company._id}`, 'PUT', newCompany, getToken);

    // setMembers([...company.users, createdMember]);
    // setSelectedMember(null);

  }

  const saveExistingMember = async (data: any) => {

    const newTeams = data.teams.map((team: any) => team.value);
    const newData = {
      ...data,
      teams: newTeams
    }

    const updatedMember = await useFetch(`/users/${data._id}`, 'PUT', newData, getToken);

    const updatedMembers = members.map((member: any) => {
      if(member._id === data._id) {
        return updatedMember;
      } else {
        return member;
      }
    });
    setMembers(updatedMembers);
    setSelectedMember(null);
  }

  const handleEditRoute = (data: any) => {
    setSelectedMember(data);
  }

  const handleDelete = async (data: any) => {
    console.log('deleting member: ', data._id);
    
    const deletedUser = await useFetch(`/users/${data._id}`, 'DELETE', {query: data}, getToken);

    const updatedMembers = members.filter((member: any) => member._id !== data._id);

    setMembers(updatedMembers);
    setSelectedMember(null);
    
		toast.success("Member successfully deleted", {
			autoClose: 2000,
			theme: 'dark'
		});

  }

  return (
    <Layout>
      <main className="w-3/4 md:w-4/5 lg:w-5/6 transition-all bg-zinc-900">
        <div className="container mx-auto px-20 py-4 lg:w-5/6">
          <div className="ml-0 divide-y divide-solid divide-zinc-800">
            <div className='py-4'>
                <h2 className='text-xl'>Members</h2>
            </div>
            {userAdmin ?
              <div className='py-4'>
                <h2 className='text-xl'>This area is currently disabled for Site Admins</h2>
              </div>
              :
              <div className='py-4 '>
                <div className='flex'>
                <div className='flex flex-grow'>
                <h2>Manage Members</h2>
                </div>
                <div className='flex flex-none justify-end'>
                  <MainButton textSize='text-sm' onClick={() => setSelectedMember('new')}>Add Member</MainButton>
                  <MemberDialog 
                    submitNewMember={submitNewMember}
                    saveExistingMember={saveExistingMember}
                    selectedMember={selectedMember} 
                    handleClose={() => setSelectedMember(null)}
                    deleteMember={handleDelete}
                    teams={teams}
                  />
                </div>
                </div>
                <div className='flex flex-col divide-y divide-solid divide-zinc-800 mt-4'>
                  {members && members.map((member: any, key: number) => {
                    const name = member.first_name ? member.first_name + ' ' + member.last_name : member.email+' (Pending)';
                    const initials = member.first_name ? member.first_name[0] + member.last_name[0] : '??';
                    return (
                      <div className='flex mb-2' key={key}>
                        <Member 
                          icon={UsersIcon} 
                          memberName={name} 
                          memberType={member.admin ? "Admin" : "Member"}
                          pending={!member.first_name}
                          initials={initials}
                          data={member}
                          onDelete={handleDelete}
                          handleEditRoute={handleEditRoute}
                        />
                      </div>                        
                    )
                  })}
                </div>
              </div>
            }            
              
          </div>
        </div>

      </main>
    </Layout>
  );
}