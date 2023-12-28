import { CreateOrganization } from '@clerk/nextjs'
import Image from 'next/image';

export default function CreateOrg() {

  return (
    <main className="flex flex-col h-screen justify-center items-center">
      <h1 className="text-3xl font-bold text-center text-white-700 flex justify-center items-center relative right-2 mb-8">
        <Image src="/512x512.png" width="40" height="40" alt="Indigo" />
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
