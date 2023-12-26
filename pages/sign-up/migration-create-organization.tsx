import MainButton from '@/components/ui/mainButton';
import MainInput from '@/components/ui/mainInput';
import authedFetch from '@/lib/authedFetch';
import { useAppStore } from '@/lib/store';
import { CreateOrganization, useAuth, useOrganization, useUser } from '@clerk/nextjs'
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function SignUpStep1() {
  const { user: clerkUser } = useUser();
  const router = useRouter();
  const [errorText, setErrorText] = useState("");
  const { signup, updateSignUp } = useAppStore()
  const [inFlight, setInFlight] = useState(false);
  const { getToken } = useAuth();
  const { organization, membership } = useOrganization();

  useEffect(() => {
    console.log('clerk user: ', clerkUser);
    console.log('migration create org: ', organization);
  }, [organization]);    

  const handleContinue = async (e: any) => {
    e.preventDefault();    

    // setInFlight(true);

    // try {
      
    //   const gotUser = await authedFetch(`/users?sub=${clerkUser?.id}`, 'GET', null, getToken);

    //   console.log('got user: ', gotUser);
      

    //   const newCompany = {
    //     name: signup?.company_name,
    //     users: [gotUser._id]
    //   }
  
    //   const companyResponse = await fetch(`/api/companies/post`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(newCompany)
    //   });
    //   const companyData = await companyResponse.json();
  
    //   console.log('company data: ', companyData);
      
    //   const newUserData = {
    //     ...gotUser,
    //     company: companyData._id
    //   }
  
    //   const updatedUserResponse = await fetch(`/api/users/put`, {
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(newUserData)
    //   });
    //   const updatedUser = await updatedUserResponse.json();
      
    //   console.log('updated user: ', updatedUser);

    //   setInFlight(false);

    //   router.push('/');

    // } catch (err: any) {
    //   console.log('error: ', err);      
    //   setInFlight(false);
    // }

  }

  return (
    <main className="flex flex-col h-screen justify-center items-center">
      <h1 className="text-3xl font-bold text-center text-white-700 flex justify-center items-center relative right-2 mb-8">
        <Image src="/512x512.png" width="40" height="40" alt="Indigo" />
        <div className="text-5xl ml-3 relative bottom-1">Indigo</div>
      </h1>
      <CreateOrganization 
        routing="path" 
        path="/sign-up/migration-create-organization" 
        />
    </main>
  )
}
