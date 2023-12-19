import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
import Sidebar from '@/components/sidebar'
import { useAppStore } from '@/lib/store'
import { useEffect } from 'react'
import { useOrganization, useUser } from '@clerk/nextjs'
import { useIntercom } from 'react-use-intercom'

interface LayoutProps {
  children?: any;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user: clerkUser } = useUser();
  const { user, fetchUserFromDB } = useAppStore()
  const { organization } = useOrganization();
  const { boot } = useIntercom();

  useEffect(() => {    
    if(!user && clerkUser && organization) {  
      fetchUserFromDB(clerkUser, organization)

      boot({
        email: clerkUser.primaryEmailAddress?.emailAddress,
        userId: clerkUser.id,
      });
    }
  }, [clerkUser, user, organization])

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