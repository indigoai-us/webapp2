import Layout from '@/components/layout';
import PageTitle from '@/components/pageTitle';
import styles from '@/styles/billing.module.css'
import Image from 'next/image';
import ComingSoonImg from '@/public/coming_soon.png';
import { UserProfile } from '@clerk/nextjs';

export default function Profile() {
  return (
    <Layout>
      <main className="w-3/4 md:w-4/5 lg:w-5/6 transition-all bg-zinc-900">
        <div className="container mx-auto px-20 py-4">
            <div className="ml-0 divide-y divide-solid divide-zinc-800">
              <PageTitle title="Profile"/>
                <div className='py-4 '>
                  <UserProfile path="/profile" routing="path" />
                </div>               
            </div>
        </div>
      </main>
    </Layout>
  );
}