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
import { useAuth, useUser } from '@clerk/nextjs';
import { useOrganization, clerkClient } from '@clerk/nextjs';
import Invited from '@/components/members/invited';
import authedFetch from '@/lib/authedFetch';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const { userId, getToken } = getAuth(ctx.req);
	
	const userData = await authedFetch(`/users?sub=${userId}`, 'GET', null, getToken);
  
  const userAdmin = userData?.data[0]?.siteAdmin;
	const orgAdmin = userData?.data[0]?.admin;
	const companyId = userData?.data[0]?.company?._id;

	const companyData = companyId ? await authedFetch('/companies/'+companyId, 'GET', null, getToken) : null;
	
	const teamsData = await authedFetch('/teams', 'GET', null, getToken);

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
  const { memberships, organization, invitations } = useOrganization({
    invitations: true,
    memberships: true,
  });

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
        role: data.admin ? 'org:admin' : 'org:member', 
        redirectUrl: "http://localhost:3000/invite-accepted" 
      })
    });

    console.log('invited user: ', invitedUser);
    setSelectedMember(null);

    // const newTeams = data.teams.map((team: any) => team.value);
    
    // const newUser = {
    //   email: data.email,
    //   teams: newTeams,
    //   company: company._id,
    //   adminCreateUser: true,
    //   admin: data.admin,
    // }
    
    // const createdMember = await authedFetch(`/users`, 'POST', newUser, getToken);

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

    // const updatedCompany = await authedFetch(`/companies/${company._id}`, 'PUT', newCompany, getToken);

    // setMembers([...company.users, createdMember]);
    // setSelectedMember(null);

  }

  const saveExistingMember = async (data: any) => {

    const numAdmins = members.filter((member: any) => member.admin).length;

    console.log('numAdmins: ', numAdmins);
    if(data.role !== 'admin' && numAdmins === 1) {
      toast.error("You must have at least one admin", {
        autoClose: 2000,
        theme: 'dark'
      });
      return;
    }    

    console.log('saving member: ', data);
    const clerkMember = memberships?.data?.find((member: any) => member.publicUserData.userId === data.sub);

    console.log('clerkMember: ', clerkMember);
    
    clerkMember?.update({role: data.role === "admin" ? 'org:admin' : 'org:member'});

    const newTeams = data.teams.map((team: any) => team.value);
    const newData = {
      ...data,
      teams: newTeams
    }

    const updatedMember = await authedFetch(`/users/${data._id}`, 'PUT', newData, getToken);

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
    
    const deletedUser = await authedFetch(`/users/${data._id}`, 'DELETE', {query: data}, getToken);

    const updatedMembers = members.filter((member: any) => member._id !== data._id);

    setMembers(updatedMembers);
    setSelectedMember(null);
    
		toast.success("Member successfully deleted", {
			autoClose: 2000,
			theme: 'dark'
		});

  }

  const handleCancel = async (inv: any) => {
    await inv.revoke();
  };

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
                <div className='flex flex-col divide-y divide-solid divide-zinc-800 mt-4'>
                  {invitations?.data && invitations?.data.map((member: any, key: number) => {
                    return (
                      <div className='flex mb-2' key={key}>
                        <Invited 
                          memberName={member.emailAddress} 
                          memberType={member.role === 'org:member' ? "Member" : "Admin"}
                          pending={member.status === 'pending'}
                          data={member}
                          onCancel={handleCancel}
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