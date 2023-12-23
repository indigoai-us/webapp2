import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function InviteAccepted() {
  const router = useRouter();
	const { __clerk_status, __clerk_ticket } = router.query;

  useEffect(() => {

    console.log('__clerk_status: ', __clerk_status);
    console.log('__clerk_ticket: ', __clerk_ticket);

    if(__clerk_status === 'sign_in') {
      router.push('/login?__clerk_status='+__clerk_status+'&__clerk_ticket='+__clerk_ticket);
    }
    if(__clerk_status === 'sign_up') {
      router.push('/sign-up?__clerk_status='+__clerk_status+'&__clerk_ticket='+__clerk_ticket);
    }
    if(__clerk_status === 'complete') {
      router.push('/');
    }
    
  }, [__clerk_status, __clerk_ticket, router]);

  return (
    <main className="flex flex-col h-screen justify-center items-center">
      <h1 className="text-3xl font-bold text-center text-white-700 flex justify-center items-center relative right-2 mb-8">
        <Image src="/512x512.png" width="40" alt="Indigo" />
        <div className="text-5xl ml-3 relative bottom-1">Indigo</div>
      </h1>
    </main>
  )
}
