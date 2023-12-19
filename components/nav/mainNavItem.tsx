import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface NavItemProps {
  Icon?: any;
  label: string;
  href: string;
  onClick?: () => void;
}

const MainNavItem: React.FC<NavItemProps> = ({ Icon, label, href, onClick }) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  const activeClass = isActive ? 'bg-zinc-800' : '';
  const activeIcon = isActive ? '!text-indigo-500' : '';



  const hasOnClick = (
    <div className={`group block px-3 py-2 mb-0 text-sm text-slate-200 font-medium hover:text-slate-100 target:text-white rounded hover:bg-zinc-800 active:bg-zinc-800 transition-all w-full ${activeClass} `}>
      <li className="parent flex items-center" onClick={onClick} style={{cursor: 'pointer'}}>
        {Icon && <Icon className=" group-hover:text-indigo-500 w-4 h-4 mr-5 text-zinc-600 transition-all " />}
        {label}
      </li>
    </div>
  )

  const noOnClick = (
    <Link href={href} className={`group block px-3 py-2 mb-0 text-sm font-medium text-slate-200 target:text-white rounded hover:bg-zinc-800 transition-all w-full ${activeClass}`}>
    <li className="parent flex items-center">
      {Icon && <Icon className={` group-hover:text-indigo-500 w-4 h-4 mr-5 text-zinc-600 transition-all ${activeIcon} `} />}
      {label}
    </li>
    </Link>
  )

  return onClick ? hasOnClick : noOnClick;
};

export default MainNavItem;