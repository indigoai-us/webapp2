import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import { useAuth, useUser } from '@clerk/nextjs'
import { useEffect, useState } from "react";
import Button from "@/components/ui/button";

export default function DesktopAuth() {
  const { user: clerkUser, isLoaded } = useUser();
  const [ userLoggedIn, setUserLoggedIn ] = useState(true);
  const [signInToken, setSignInToken] = useState<any>(null);
  const [generatingSignInToken, setGeneratingSignInToken] = useState(false);

  useEffect(() => {
    if(isLoaded) {
      if(clerkUser) {
        console.log('loaded clerk user: ', clerkUser); 
        const generateSigninToken = async () => {
          setGeneratingSignInToken(true);
          const bodyObj = {
            "user_id": clerkUser.id,
            "expires_in_seconds": 2592000
          };
  
          const getResponse = await fetch(`/api/clerk/createSigninToken`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyObj)
          });
          const signInToken = await getResponse.json(); 
          
          setSignInToken(signInToken.response.token);
          
        }
  
        generateSigninToken();
      } else {
        console.log('loaded no clerk user: ', clerkUser);              
        setUserLoggedIn(false);       
      }  
    }
  }, [clerkUser, isLoaded]); 

  return (
    <main className="flex flex-col h-screen justify-center items-center">
      <h1 className="text-3xl font-bold text-center text-white-700 flex justify-center items-center relative right-2 mb-8">
        <Image 
          src="/512x512.png" 
          width="40" 
          alt="Indigo" 
          height={40}
        />
        <div className="text-5xl ml-3 relative bottom-1">Indigo</div>
      </h1>
      {isLoaded && !userLoggedIn &&
        <SignIn 
          path="/desktop-auth" 
          routing="path" 
          signUpUrl="/sign-up" 
          afterSignInUrl="/desktop-auth/finishing"
          />
      }
      {generatingSignInToken && !signInToken &&
        <span className="mt-4">Finishing...</span>
      }
      {generatingSignInToken && signInToken &&
        <span className="mt-4">Success! Click the button below to return to Indigo.</span>
      }
      {signInToken &&
        <Button
          className="mt-4"
          onClick={() => {
            window.open(`indigo://auth/sign-in/${signInToken}`, '_blank');
          }}
        >Open Indigo</Button>
      }
    </main>
  )
}
