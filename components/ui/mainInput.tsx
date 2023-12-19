import React from 'react';

type InputLabelProps = {
  label?: string;
};

const InputLabel: React.FC<InputLabelProps> = ({ label }) => (
  <label className="block text-sm text-slate-300">{label}</label>
);

type IconWrapperProps = {
  icon?: React.ReactNode;
  position?: 'left' | 'right';
  iconOnClick?: () => void;
  children: React.ReactNode;
};

const IconWrapper: React.FC<IconWrapperProps> = ({ icon, position, children, iconOnClick }) => (
  <div className="relative">
    {children}
    {icon && (
      <button
        onClick={iconOnClick}
        className={`absolute inset-y-0 top-2 ${position === 'left' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center`}
      >
        {icon}
      </button>
    )}
  </div>
);

type MainInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string | any;
  icon?: any;
  iconPosition?: 'left' | 'right';
  iconOnClick?: () => void;
};

const MainInput: React.FC<MainInputProps> = ({ label, className, icon, iconPosition = 'right', iconOnClick, ...props }) => {
  
  return (
    <div>
      <InputLabel label={label} />
      <IconWrapper icon={icon} position={iconPosition} iconOnClick={iconOnClick}>
        <input
          className={`mt-2 w-full font-light outline-none focus-visible:ring-0 border rounded-md border-solid border-zinc-800 hover:border-zinc-300 focus:border-indigo-500 transition-all bg-zinc-900 text-white py-2 text-sm placeholder:text-zinc-500 placeholder:text-sm transition-all ${
            icon
              ? iconPosition === 'left'
                ? 'pl-10 pr-2'
                : 'pl-2 pr-10'
              : 'pl-2 pr-2'
          } ${className}`}
          {...props}
        />
      </IconWrapper>
    </div>
  );
}

export default MainInput;