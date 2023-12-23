import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

const TeamsEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      
      <h1 className='text-4xl mt-8'>Uh oh! No teams?!?!</h1>
      <div className='text-8xl mt-4'>🤔</div>
      <h2 className='text-xl mt-4'>{`I think it's time to figure this one out...`}</h2>
      <div className='items-start'>
        <div className='text-2xl mt-8'>
          Here are some things you can do:
        </div>
        <ul className='mt-2 list-disc pl-5'>
          <li>Make a team</li>
          <li>Put some members on teams</li>
          <li>Assign teams to commands</li>
        </ul>
      </div>
    </div>
  );
}

export default TeamsEmpty;