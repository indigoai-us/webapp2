import React from 'react';

interface PageTitleProps {
  title: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  return (
    <div className='py-4 mt-2'>
      <h2 className='text-xl font-semibold'>{title}</h2>
    </div>
  );
};

export default PageTitle;