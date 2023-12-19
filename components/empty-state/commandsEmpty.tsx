import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

const CommandsEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      
      <h1 className='text-4xl'>Uh oh! No commands?!?!</h1>
      <div className='text-8xl mt-4'>🤔</div>
      <h2 className='text-xl mt-4'>I think it's time to figure this one out...</h2>
      <div className='items-start'>
        <div className='text-2xl mt-8'>
          Here are some things you can do:
        </div>
        <ul className='mt-2 list-disc pl-5'>
          <li>Import a command from the Marketplace</li>
          <li>Build a command from scratch</li>
          <li>Ask for help in the Discord</li>
        </ul>
      </div>
    </div>
  );
}

export default CommandsEmpty;