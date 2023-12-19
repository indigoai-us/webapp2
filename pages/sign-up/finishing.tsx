import MainButton from '@/components/ui/mainButton';
import { useAppStore } from '@/lib/store';
import { useOrganization, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function SignUpFinishing() {
  const { user: clerkUser } = useUser();
  const { organization } = useOrganization();
  const router = useRouter();
  const [errorText, setErrorText] = useState("");
  const [inFlight, setInFlight] = useState(false);
  const { signup, updateSignUp } = useAppStore()

  useEffect(() => {
    if(clerkUser && organization && !inFlight) {
      setInFlight(true);
      finishAccount();      
    }
    
  }, [clerkUser, organization]);  

  const finishAccount = async () => {
    console.log('clerk user: ', clerkUser);
    console.log('organization: ', organization);      

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
        name: organization?.name,
        sub: organization?.id,
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
    <div className="flex flex-col p-2 h-screen bg-zinc-900">
      {/* Logo header */}
      <div className="grow-0 h-auto">
        <h1 className="text-3xl font-bold text-white-700 flex items-center relative right-1">
          <img src="/512x512.png" width="40" />
          <div className="text-5xl ml-3 relative bottom-1">Indigo</div>
        </h1>
      </div>

      Finishing...

      <div className="grow-0 h-[150px]"></div>
    </div>
  )
}
