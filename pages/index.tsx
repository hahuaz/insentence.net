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
      <main className="max-w-screen-xl mx-auto">
        <div className="flex justify-around">
          <div className="max-w-screen-sm space-y-3">
            <h1 className="text-4xl ">
              <span className="text-black font-display font-medium">
                insentence.net
              </span>{' '}
              <span className="text-blue">/</span>{' '}
              <span className="font-serif italic font-light text-2xl text-gray ">
                Improve Your English!
              </span>
            </h1>
            <div className="text-xl font-light ">
              <p>Most effective ...</p>
              <p>
                We provide top notch pronunciation for every sentence so you can
                read, listen and repeat.
              </p>
            </div>
          </div>
          <div>
            <TextRotatorWithNoSSR />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
