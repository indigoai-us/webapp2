import React from 'react';;
import DataMenu from '@/components/data/dataMenu';

type DataProps = {
  dataName: string;
  dataUsage: string;
  id: string;
  onDelete?: (id: string) => void;
  handleEditRoute?: (id: string) => void;
};

const DataRow: React.FC<DataProps> = ({ dataName, dataUsage, id, onDelete, handleEditRoute }) => {

  const editRoute = (event: any) => {
    handleEditRoute && handleEditRoute(id);
  }    

  return (
    <div className="group rounded-xl drop-shadow-sm bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700 shadow-sm hover:border-indigo-500 hover:shadow-glow  border border-solid p-4 text-xs flex transition-colors">
      <div className='flex flex-col flex-grow'>
        <div onClick={editRoute} className='flex-none flex text-sm cursor-pointer '>
          {dataName} 
          <span className='ml-2' onClick={(e: any) => e.stopPropagation()}>
            <DataMenu id={id} onDelete={onDelete} editRoute={handleEditRoute}/>
          </span>
        </div>
        <div className='text-xs flex flex-grow py-1 text-gray-500'>Used by <span className='font-bold mx-1'> {dataUsage} </span> Command(s)</div>
      </div>
      <div className='flex flex-col justify-top align-top'>        
        <span className='px-2 py-0.5 mb-2 rounded-xl bg-gray-600 text-xs'>Snippets</span>  
        <span className='text-right text-gray-500'> 2 Value(s)</span> 
      </div>
    </div>
  )
};

export default DataRow;