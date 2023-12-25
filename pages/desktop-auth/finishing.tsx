import Button from '@/components/ui/button';
import { useAuth, useUser } from '@clerk/nextjs'
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function DesktopAuthFinishing() {
  const { user: clerkUser } = useUser();
  const [inFlight, setInFlight] = useState(false);
  const [signInToken, setSignInToken] = useState<any>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    console.log('clerk user: ', clerkUser); 
    if(clerkUser) {
      const generateSigninToken = async () => {
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
    }
  }, [clerkUser]);  
  
  return (
    <main className="flex flex-col h-screen justify-center items-center">
      {/* Logo header */}
      <div className="grow-0 h-auto">
        <h1 className="text-3xl font-bold text-white-700 flex items-center relative right-1">
          <Image src="/512x512.png" width="40" height="40" alt="Indigo" />
          <div className="text-5xl ml-3 relative bottom-1">Indigo</div>
        </h1>
      </div>

      {!signInToken ?
        <span className="mt-4">Finishing...</span>
        :
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

      <div className="grow-0 h-[150px]"></div>
    </main>
  )
}
