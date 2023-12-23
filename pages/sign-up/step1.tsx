import MainButton from '@/components/ui/mainButton';
import { useAppStore } from '@/lib/store';
import { useUser } from '@clerk/nextjs'
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function SignUpStep1() {
  const { user: clerkUser } = useUser();
  const router = useRouter();
  const [errorText, setErrorText] = useState("");
  const { signup, updateSignUp } = useAppStore()

  const handleContinue = (e: any) => {
    e.preventDefault();

    if(!signup?.bio) {
      setErrorText("Please enter a bio");
      return;
    }

    router.push('/sign-up/step2');
  }

  const textAreaLength = signup?.bio ? signup?.bio?.length : 0;

  return (
    <div className="flex flex-col p-2 h-screen bg-zinc-900">
      {/* Logo header */}
      <div className="grow-0 h-auto">
        <h1 className="text-3xl font-bold text-white-700 flex items-center relative right-1">
          <Image src="/512x512.png" width="40" alt="Indigo" />
          <div className="text-5xl ml-3 relative bottom-1">Indigo</div>
        </h1>
      </div>
      {/* Form */}
      <div className="grow items-center flex justify-center">
        <form onSubmit={handleContinue} className="w-1/3">
          <div>
            <h1 className="text-3xl mb-6 font-semibold">Welcome to IndigoAI, {clerkUser?.firstName}!</h1>
            <h2 className="text-lg mb-10 font-light">Provide a short description of your role, experience, and expertise.</h2>
            <div className="flex flex-col mb-4">
              <div className="flex flex-col mb-4" style={{alignItems: 'flex-end'}}>
                <textarea 
                  rows={6}
                  className="bg-zinc-900 h-auto mt-2 mb-4 outline-none border-solid border-zinc-800 border rounded-md w-full bg-zinc-900 text-white text-sm font-light p-2 block focus:ring-transparent focus:border-indigo-600 hover:border-zinc-600 transition-all"
                  placeholder="Enter your background/bio"
                  name="bio"
                  value={signup?.bio}
                  maxLength={2048}
                  onChange={(e: any) => updateSignUp({ ...signup, [e.target.name]: e.target.value })}    
                />
                <div className={`text-sm ${textAreaLength > 2047 ? "text-red-500" : "text-gray-500"}`}>
                  {textAreaLength}/2048 characters
                </div>
              </div>
            </div>
            {errorText &&
              <div className="flex flex-col mt-8 mb-4 text-red-500">
                {errorText}
              </div>          
            }
            <div className="flex flex-col mt-8 mb-4">
              <MainButton className="w-full py-2" type="submit">
                Continue 🙌
              </MainButton>
            </div>
          </div>
          {/* <div className="flex flex-row justify-end">
            <div className="cursor-pointer" onClick={() => router.back()}>
              {"< Back"}
            </div>
          </div> */}
        </form>
      </div>
      <div className="grow-0 h-[150px]"></div>
    </div>
  )
}
