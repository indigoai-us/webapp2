import '../styles/globals.css'
import { ClerkProvider } from "@clerk/nextjs";
import type { AppProps } from "next/app";
import Head from 'next/head'
import { dark } from '@clerk/themes';
import { IntercomProvider } from 'react-use-intercom';
import PageLoading from '@/components/pageLoading';
import { useEffect, useState } from 'react';
import Router from "next/router";
import { motion } from 'framer-motion'

const INTERCOM_APP_ID = 'qr3vpq8v';

function MyApp({ Component, pageProps, router }: AppProps) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const start = () => {
      console.log("start");
      setLoading(true);
    };
    const end = () => {
      console.log("finished");
      setLoading(false);
    };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  return (
    <motion.div
      key={router.route}  
      initial="pageInitial"
      animate="pageAnimate"
      
      variants={{
        pageInitial: {
          opacity: 0,
        },
        pageAnimate: {
          opacity: 1,
        },
      }}    
    >
      <Head>
        <title>IndigoAI</title>
        <meta name="description" content="IndigoAI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ClerkProvider {...pageProps} 
        publishableKey="pk_test_dGhhbmtmdWwtZmluY2gtODEuY2xlcmsuYWNjb3VudHMuZGV2JA"
        appearance={{
          baseTheme: dark
        }}
        >
        <IntercomProvider appId={INTERCOM_APP_ID} autoBoot>
          {loading ? (
            <PageLoading />
          ) : (
            <Component {...pageProps} />
          )}        
        </IntercomProvider>
      </ClerkProvider>
    </motion.div>
  );
}
export default MyApp;