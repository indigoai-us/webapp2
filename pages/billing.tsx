import Layout from '@/components/layout';
import PageTitle from '@/components/pageTitle';
import ComingSoonImg from '@/public/coming_soon.png';
import Image from 'next/image';
import styles from '@/styles/billing.module.css'

export default function Billing() {
  return (
    <Layout>
      <main className="w-full md:w-4/5 lg:w-5/6 transition-all bg-zinc-900">
        <div className="container mx-auto px-20 py-4 w-full">
            <div className="ml-0 divide-y divide-solid divide-zinc-800 w-full">
              <PageTitle title="Billing"/>
                <div className='py-4 '>
                  <div className={styles.imageContainer}>
                      <Image 
                        src={ComingSoonImg} 
                        alt="Coming Soon" 
                        width={800} 
                        height={800}
                        />
                  </div>
                </div>
            </div>
        </div>

      </main>
    </Layout>
  );
}