import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  textSize?: 'text-xs' | 'text-sm' | 'text-md';
  icon?: React.ReactNode;
  withShadow?: boolean;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, textSize = 'text-md', icon, withShadow = true, ...props }, ref) => (
    <button
      ref={ref}
      className={`bg-indigo-700 rounded-md px-4 py-2 transition-all hover:bg-indigo-600 active:bg-indigo-700 focus:outline-none ${textSize} ${className}`}
      style={{
        boxShadow: withShadow ? 'inset 0px 0px 20px rgba(0, 0, 0, 0.25), inset 0px 0px 6px rgba(0, 0, 0, 0.25)' : undefined,
        borderRadius: '6px',
      }}
      {...props}
    >
      <div className="flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </div>
    </button>
  )
);

Button.displayName = 'Button';

export default Button;