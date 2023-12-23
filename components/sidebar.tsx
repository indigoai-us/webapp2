import { useRouter } from 'next/router';
import { UserButton, useUser } from '@clerk/nextjs';
import { Squares2X2Icon, BoltIcon, LifebuoyIcon, AdjustmentsHorizontalIcon, BuildingStorefrontIcon, RectangleStackIcon, HomeIcon } from '@heroicons/react/20/solid';
import MainNavItem from './nav/mainNavItem';
import { useAppStore } from '@/lib/store'
import { useEffect, useState } from 'react';
import SettingsMenu from './SettingsMenu';
import { useIntercom } from 'react-use-intercom';
import GemImg from '@/public/512x512.png';
import Image from 'next/image';

export default function Sidebar (){
  const user = useUser();
  const { user: zustandUser, clearUser } = useAppStore()
	const [localUser, setLocalUser] = useState<any>(null);
  const { shutdown, show } = useIntercom();

	useEffect(() => {
		setLocalUser(zustandUser);
	}, [zustandUser])

  useEffect(() => {
    if (!user.isSignedIn) {
      // User has signed out, perform your cleanup logic here
      clearUser();
      shutdown();
    }
  }, [user.isSignedIn, clearUser, shutdown]);

	const showIntercom = () => {
    // @ts-ignore
    // window.Intercom('show');
    show();
  }

	const handleLogout = async () => {
		console.log('logging out');
	}	

	return(
		<div className="w-48">
			<div>     
				<nav>
					<aside className='fixed mt-0 ml-0 w-48'>
						<ul className="ml-4 mt-6 pr-3">
							{/* Logo */}
							<li className="mb-4">
								<div className="text-3xl font-bold text-center text-white-700 flex items-center ml-2">
									<Image 									
										src={GemImg} 
										alt="Indigo" 
										className='w-8 h-8 relative right-1'
										height={40}
										width={40}
									/>
									<div className="text-xl ml-2">Indigo</div>
								</div>
							</li>
							<MainNavItem Icon={BoltIcon} label="Commands" href="/"/>
							<MainNavItem Icon={AdjustmentsHorizontalIcon} label="Data" href="/data"/>						
							{localUser?.admin && <MainNavItem Icon={Squares2X2Icon} label="Teams" href="/teams"/>}
							{localUser?.admin && <MainNavItem Icon={RectangleStackIcon} label="Models" href="/models"/>}
						</ul>

						<div className="fixed bottom-0 w-72">
							<ul className="ml-4 pr-3">
								<MainNavItem Icon={LifebuoyIcon} label="Support" href="#" onClick={showIntercom}/>
							</ul>
							<div className=' bg-zinc-800 py-4 px-8 flex flex-row w-full items-center mt-2'>
								<div className='flex flex-col flex-grow'>
									<div>{localUser?.company?.name}</div>
									<div className='text-xs text-zinc-500'>{localUser?.email}</div>
								</div>
								<div>
									<SettingsMenu
										handleLogout={handleLogout}
									/>
								</div>
							</div>
						</div>
					</aside>
				</nav>   			
			</div>
		</div>
	)
}