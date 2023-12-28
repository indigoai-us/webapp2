import MainButton from '@/components/ui/mainButton';
import authedFetch from '@/lib/authedFetch';
import finishAccount from '@/lib/finishAccount';
import { useAppStore } from '@/lib/store';
import { useAuth, useOrganization, useUser } from '@clerk/nextjs'
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function SignUpFinishing() {
  const { user: clerkUser } = useUser();
  const { organization, membership } = useOrganization();
  const router = useRouter();
  const [errorText, setErrorText] = useState("");
  const [inFlight, setInFlight] = useState(false);
  const { signup, updateSignUp } = useAppStore()
  const { getToken } = useAuth();

  useEffect(() => {
    console.log('clerk user: ', clerkUser);
    console.log('organization: ', organization);
    console.log('membership: ', membership);
    
    if(clerkUser && organization && !inFlight) {
      setInFlight(true);

      // const finishAccount = async ({clerkUser, organization, membership}: any) => {
      //   console.log('clerk user: ', clerkUser);
      //   console.log('organization: ', organization);
      //   console.log('membership: ', membership);   
    
      //   try {
      //     const newUser = {
      //       email: clerkUser?.primaryEmailAddress?.emailAddress,
      //       first_name: clerkUser?.firstName,
      //       last_name: clerkUser?.lastName,
      //       sub: clerkUser?.id,
      //       admin: true
      //     }
      
      //     const userResponse = await fetch(`/api/users/post`, {
      //       method: 'POST',
      //       headers: {
      //         'Content-Type': 'application/json'
      //       },
      //       body: JSON.stringify(newUser)
      //     });
      //     const userData = await userResponse.json();
      
      //     console.log('user data: ', userData);
          
      //     const newCompany = {
      //       name: organization?.name,
      //       sub: organization?.id,
      //       users: [userData._id]
      //     }
    
      //     const gotCompanies = await authedFetch(`/companies?sub=${organization?.id}`, 'GET', null, getToken);
      //     console.log('got companies: ', gotCompanies);      
    
      //     const postNewCompany = async() => {
      //       const companyResponse = await fetch(`/api/companies/post`, {
      //         method: 'POST',
      //         headers: {
      //           'Content-Type': 'application/json'
      //         },
      //         body: JSON.stringify(newCompany)
      //       });
      //       const companyData = await companyResponse.json();
        
      //       console.log('company data: ', companyData);
      //       return companyData;
      //     }
    
      //     const companyId = gotCompanies?.data[0]?._id || await postNewCompany();
    
      //     const newUserData = {
      //       ...userData,
      //       company: companyId,
      //       admin: membership?.role === 'org:member' ? false : true,
      //       teams: []
      //     }
    
      //     const updatedUserResponse = await fetch(`/api/users/put`, {
      //       method: 'PUT',
      //       headers: {
      //         'Content-Type': 'application/json'
      //       },
      //       body: JSON.stringify(newUserData)
      //     });
      //     const updatedUser = await updatedUserResponse.json();
          
      //     console.log('updated user: ', updatedUser);
    
      //     if(gotCompanies?.data[0]) {
      //       const newCompany = {
      //         ...gotCompanies?.data[0],
      //         users: [
      //           ...gotCompanies?.data[0].users.map((user: any) => user._id),
      //           updatedUser._id
      //         ]
      //       }
      //       delete newCompany._id;
      //       delete newCompany.createdAt;
      //       delete newCompany.updatedAt;
    
      //       console.log('new company: ', newCompany);        
    
      //       const updatedCompany = await authedFetch(`/companies/${gotCompanies?.data[0]?._id}`, 'PUT', newCompany, getToken);
            
      //       console.log('updated company: ', updatedCompany);
      //     }
    
      //     setInFlight(false);
    
      //     router.push('/');
    
      //   } catch (err: any) {
      //     console.log('error: ', err);      
      //     setInFlight(false);
      //   }
      // }
      const handleFinish = async () => {
        try {
          await finishAccount({clerkUser, organization, membership, getToken});
          setInFlight(false);
          router.push('/');
        } catch (err: any) {
          console.log('error: ', err);      
          setInFlight(false);
        }
      }
      handleFinish();
    }
    
  }, [clerkUser, organization, inFlight, getToken, membership, router]);  
  
  return (
    <div className="flex flex-col p-2 h-screen bg-zinc-900">
      {/* Logo header */}
      <div className="grow-0 h-auto">
        <h1 className="text-3xl font-bold text-white-700 flex items-center relative right-1">
          <Image src="/512x512.png" width="40" alt="Indigo" />
          <div className="text-5xl ml-3 relative bottom-1">Indigo</div>
        </h1>
      </div>

      Finishing...

      <div className="grow-0 h-[150px]"></div>
    </div>
  )
}
