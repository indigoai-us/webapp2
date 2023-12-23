import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function Login() {

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
      <SignIn path="/login" routing="path" signUpUrl="/sign-up" />
    </main>
  )
}
