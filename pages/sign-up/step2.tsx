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

  const textAreaLength = signup?.company ? signup?.company?.length : 0;

  return (
    <div className="flex flex-col p-2 h-screen bg-zinc-900">
      {/* Logo header */}
      <div className="grow-0 h-auto">
        <h1 className="text-3xl font-bold text-white-700 flex items-center relative right-1">
          <img src="/512x512.png" width="40" />
          <div className="text-5xl ml-3 relative bottom-1">Indigo</div>
        </h1>
      </div>
      {/* Form */}
      
      <CreateOrganization routing="path" path="/create-organization" />

      {/* <div className="grow items-center flex justify-center">
        <form onSubmit={handleContinue} className="w-1/3">
          <div>
            <h1 className="text-3xl mb-6 font-semibold">Tell us about your company</h1>
            <h2 className="text-lg mb-10 font-light">Please provide a thorough explanation of your company, products, customers, and key selling points.</h2>
            <div className="flex flex-col mb-4">
              <div className="flex flex-col mb-4" style={{alignItems: 'flex-end'}}>
                <textarea 
                  rows={6}
                  className="bg-zinc-900 h-auto mt-2 mb-4 outline-none border-solid border-zinc-800 border rounded-md w-full bg-zinc-900 text-white text-sm font-light p-2 block focus:ring-transparent focus:border-indigo-600 hover:border-zinc-600 transition-all"
                  placeholder="Enter company details"
                  name="company"
                  value={signup?.company}
                  maxLength={2048}
                  onChange={(e: any) => updateSignUp({ ...signup, [e.target.name]: e.target.value })}    
                />
                <div className={`text-sm ${textAreaLength > 2047 ? "text-red-500" : "text-gray-500"}`}>
                  {textAreaLength}/2048 characters
                </div>
              </div>
              <div className="flex flex-col mb-4">
                <MainInput
                  className="!text-lg"
                  type="text"
                  value={signup?.company_name}
                  placeholder="Enter your company name"
                  label="Company Name"
                  name="company_name"
                  onChange={(e: any) => updateSignUp({ ...signup, [e.target.name]: e.target.value })}
                />
              </div>
            </div>
            {errorText &&
              <div className="flex flex-col mt-8 mb-4 text-red-500">
                {errorText}
              </div>          
            }
            <div className="flex flex-col mt-8 mb-4">
              {inFlight ?
                <div className="flex flex-col items-center">
                  Creating Account...
                </div>
                :
                <MainButton className="w-full py-2" type="submit">
                  Continue 🙌
                </MainButton>
              }
            </div>
          </div>
          <div className="flex flex-row justify-end">
            <div className="cursor-pointer" onClick={() => router.back()}>
              {"< Back"}
            </div>
          </div>
        </form>
      </div> */}
      <div className="grow-0 h-[150px]"></div>
    </div>
  )
}
