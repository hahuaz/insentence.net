import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import '../styles/globals.css';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>InSentence.net | Practice English</title>
        <meta
          content="Practice and improve your English with thousands of example sentences with pronunciation."
          name="description"
        ></meta>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="min-h-screen flex flex-col justify-between">
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </div>
    </>
  );
}

export default MyApp;
