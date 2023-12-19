import React from 'react';

type MainButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  textSize?: 'text-xs' | 'text-sm' | 'text-md';
  icon?: React.ReactNode;
  href?: any;
  color?: 'indigo' | 'grey';
};

const MainButton: React.FC<MainButtonProps> = ({ children, className, textSize = 'text-md', icon, color = 'indigo', ...props }) => {
  const buttonClass = color === 'grey' ? 
  'bg-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-800 hover:from-zinc-800 hover:to-zinc-700 border border-solid border-zinc-700 hover:border-indigo-600 hover:shadow-glow rounded-3xl px-4 py-2 transition-all hover:bg-gray-600 active:bg-gray-700 focus:outline-none':  
  'bg-indigo-500 bg-gradient-to-br from-indigo-400 to-indigo-500 hover:from-indigo-300 hover:to-indigo-400 border border-solid border-indigo-400 hover:border-indigo-300 rounded-3xl px-4 py-2 transition-all hover:bg-indigo-600 active:bg-indigo-700 focus:outline-none hover:shadow-glow' ;
    

  return (
    <button className={`${buttonClass} ${textSize} ${className}`} {...props}>
      <div className="flex items-center justify-evenly">
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </div>
    </button>
  );
};

export default MainButton;