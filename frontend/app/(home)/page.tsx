import { useEffect } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";

import TextRotator from "../components/TextRotator";

const Home: NextPage = () => {
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
      <main className="max-w-screen-xl mx-auto ">
        <div className="landing-hero max-w-screen-md mx-auto space-y-3 min-h-[400px] rounded-xl">
          <h1 className="text-4xl ">
            <span className="text-black font-display font-medium">
              insentence.net
            </span>{" "}
            <span className="text-cblue">/</span>{" "}
            <span className="font-serif italic font-light text-2xl text-cgray ">
              Improve Your English!
            </span>
          </h1>
          <ul className="text-lg font-light list-disc list-inside pl-4 marker:text-black">
            {/* <p>Most effective ...</p> */}
            <li>
              Designed with the student in mind, this platform offers a unique
              learning experience.
            </li>
            <li>
              Each word and sentence is accompanied by clear pronunciation.
            </li>
            <li>
              <TextRotator />
            </li>
          </ul>
        </div>
      </main>
    </>
  );
};

export default Home;
