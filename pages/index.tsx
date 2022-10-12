import { useEffect } from 'react';
import type { NextPage } from 'next';

import dynamic from 'next/dynamic';

const TextRotatorWithNoSSR = dynamic(
  () => import('../components/TextRotator'),
  { ssr: false }
);

const Home: NextPage = () => {
  return (
    <>
      <TextRotatorWithNoSSR />
      <div className="flex min-h-screen flex-col items-center justify-center py-2">
        <main className="">
          <h1>Welcome to insentence.net</h1>
        </main>
      </div>
    </>
  );
};

export default Home;
