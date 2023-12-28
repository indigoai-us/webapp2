import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function SignUpRoute() {
  const router = useRouter();
	const { __clerk_status } = router.query;
  console.log('clerk status: ', __clerk_status);  

  return (
    <main className="flex flex-col h-screen justify-center items-center">
      <h1 className="text-3xl font-bold text-center text-white-700 flex justify-center items-center relative right-2 mb-8">
        <Image src="/512x512.png" width="40" height="40" alt="Indigo" />
        <div className="text-5xl ml-3 relative bottom-1">Indigo</div>
      </h1>
      <SignUp
        routing="path" 
        path="/sign-up"
        afterSignUpUrl={__clerk_status ? "/sign-up/finishing" : "/sign-up/create-organization"}
      />
    </main>
  )
}
