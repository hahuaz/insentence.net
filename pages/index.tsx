import { useEffect } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';

import dynamic from 'next/dynamic';

const TextRotatorWithNoSSR = dynamic(
  () => import('../components/TextRotator'),
  { ssr: false }
);

const Home: NextPage = () => {
  return (
    <>
      <main className="max-w-screen-xl mx-auto ">
        <div className="landing-hero max-w-screen-md mx-auto space-y-3 min-h-[400px] rounded-xl">
          <h1 className="text-4xl ">
            <span className="text-black font-display font-medium">
              insentence.net
            </span>{' '}
            <span className="text-cblue">/</span>{' '}
            <span className="font-serif italic font-light text-2xl text-cgray ">
              Improve Your English!
            </span>
          </h1>
          <ul className="text-lg font-light list-disc list-inside pl-4 marker:text-black">
            {/* <p>Most effective ...</p> */}
            <li>Created for learners by learner.</li>
            <li>
              Every sentence has pronunciation so you can read, listen and
              repeat.
            </li>
            <li>
              <TextRotatorWithNoSSR />
            </li>
          </ul>
        </div>
      </main>
    </>
  );
};

export default Home;
