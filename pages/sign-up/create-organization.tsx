import MainButton from '@/components/ui/mainButton';
import MainInput from '@/components/ui/mainInput';
import { useAppStore } from '@/lib/store';
import { CreateOrganization, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function SignUpStep1() {
  const { user: clerkUser } = useUser();
  const router = useRouter();
  const [errorText, setErrorText] = useState("");
  const { signup, updateSignUp } = useAppStore()
  const [inFlight, setInFlight] = useState(false);

  const handleContinue = async (e: any) => {
    e.preventDefault();
    
    if(!signup?.company) {
      setErrorText("Please enter a company description");
      return;
    }

    if(!signup?.company_name) {
      setErrorText("Please enter a company name");
      return;
    }

    setInFlight(true);

    try {
      const newUser = {
        email: clerkUser?.primaryEmailAddress?.emailAddress,
        first_name: clerkUser?.firstName,
        last_name: clerkUser?.lastName,
        sub: clerkUser?.id,
        admin: true
      }
  
      const userResponse = await fetch(`/api/users/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });
      const userData = await userResponse.json();
  
      console.log('user data: ', userData);
      
      const newCompany = {
        name: signup?.company_name,
        users: [userData._id]
      }
  
      const companyResponse = await fetch(`/api/companies/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCompany)
      });
      const companyData = await companyResponse.json();
  
      console.log('company data: ', companyData);
      
      const newUserData = {
        ...userData,
        company: companyData._id
      }
  
      const updatedUserResponse = await fetch(`/api/users/put`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUserData)
      });
      const updatedUser = await updatedUserResponse.json();
      
      console.log('updated user: ', updatedUser);

      setInFlight(false);

      router.push('/');

    } catch (err: any) {
      console.log('error: ', err);      
      setInFlight(false);
    }

  }

  return (
    <main className="flex flex-col h-screen justify-center items-center">
      <h1 className="text-3xl font-bold text-center text-white-700 flex justify-center items-center relative right-2 mb-8">
        <img src="/512x512.png" width="40" />
        <div className="text-5xl ml-3 relative bottom-1">Indigo</div>
      </h1>
      <CreateOrganization 
        routing="path" 
        path="/sign-up/create-organization" 
        afterCreateOrganizationUrl="/sign-up/finishing" 
        />
    </main>
  )
}
