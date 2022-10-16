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
        <div className="landing-hero max-w-screen-md mx-auto space-y-3 min-h-[400px] rounded-xl">
          <h1 className="text-4xl ">
            <span className="text-black font-display font-medium">
              insentence.net
            </span>{' '}
            <span className="text-blue">/</span>{' '}
            <span className="font-serif italic font-light text-2xl text-gray ">
              Improve Your English!
            </span>
          </h1>
          <ul className="text-lg font-light list-disc list-inside pl-4 marker:text-black">
            {/* <p>Most effective ...</p> */}
            <li>Created for learners by learner.</li>
            <li>
              Every sentence has top notch pronunciation so you can read, listen
              and repeat.
            </li>
            <li>
              <TextRotatorWithNoSSR />
            </li>
          </ul>
        </div>
        <div className="h-[1500px]">create scrollbacr</div>
      </main>
    </>
  );
};

export default Home;
