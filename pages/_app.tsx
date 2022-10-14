import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import Navbar from '../components/Navbar';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>insentence.net | Practice English</title>
        <meta
          content="Practice and improve your English with thousands of example sentences with pronunciation."
          name="description"
        ></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar></Navbar>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
