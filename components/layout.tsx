import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
import Sidebar from '@/components/sidebar'
import { useAppStore } from '@/lib/store'
import { useEffect, useState } from 'react'
import { useAuth, useOrganization, useUser } from '@clerk/nextjs'
import { useIntercom } from 'react-use-intercom'
import { useRouter } from 'next/router'
import OrgDialog from './dialogs/orgDialog'

interface LayoutProps {
  children?: any;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user: clerkUser, isLoaded: clerkUserIsLoaded } = useUser();
  const { user, fetchUserFromDB } = useAppStore()
  const { organization, membership, isLoaded: orgIsLoaded } = useOrganization();
  const { boot } = useIntercom();
  const router = useRouter();
  const { getToken } = useAuth();
  const [orgDialogOpen, setOrgDialogOpen] = useState(false);

  useEffect(() => {
    console.log('clerkUser: ', clerkUser);
    console.log('user: ', user);
    console.log('organization: ', organization);    
    console.log('orgIsLoaded: ', orgIsLoaded);
    console.log('clerkUserIsLoaded: ', clerkUserIsLoaded);    
    
    if(orgIsLoaded && !organization) {
      router.push('/sign-up/create-organization');
    }

    if(!user && clerkUser && organization) {  
      fetchUserFromDB(clerkUser, organization, membership, getToken)

      boot({
        email: clerkUser.primaryEmailAddress?.emailAddress,
        userId: clerkUser.id,
      });
    }
  }, [clerkUser, user, organization, boot, fetchUserFromDB])

  return (
    <div className={`${inter.className} overscroll-none`}>
      <div className="flex text-slate-200 divide-zinc-800 divide-x">

        {/* Sidebar navigation */}
        <nav className="w-72 h-screen transition-all bg-zinc-900 flex-none ">
          <Sidebar/>
        </nav>

        {/* Main content section */}
        {children}
        
      </div>
    </div>
  );
}

export default Layout;