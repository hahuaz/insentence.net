import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import classNames from 'classnames';

const alphabet = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
];
const Letter: NextPage = () => {
  const [wordList, setWordList] = useState<any[]>([]);

  const { query } = useRouter();
  const { slug: letter } = query;

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (!letter) return;
    const controller = new AbortController();
    try {
      const getData = async () => {
        const response = await fetch(
          `${BACKEND_URL}word?starts-with=${letter}`,
          {
            signal: controller.signal,
          }
        );

        const data = await response.json();
        setWordList(data);
      };
      getData();
    } catch (error) {
      console.log(error);
    }

    return () => {
      controller.abort();
    };
  }, [letter]);

  return (
    <>
      <Head>
        <title>InSentence.net | Practice English</title>
        <meta
          content={`Example words that starts with letter ${letter}.`}
          name="description"
        ></meta>
      </Head>
      <div className="max-w-screen-md mx-auto mb-auto">
        <ul className="flex gap-2 mt-4 mb-6">
          {alphabet.map((el) => {
            return (
              <li
                className={`px-1 border-b-4  ${
                  el === letter ? 'border-corange' : 'border-transparent'
                }`}
                key={el}
              >
                <Link href={`/letter/${el}`}>
                  <a>{el.toUpperCase()}</a>
                </Link>
              </li>
            );
          })}
        </ul>
        <div>
          <div className="grid grid-cols-3 gap-y-6">
            {wordList.map((word, i) => {
              return (
                <span key={i} className=" text-blue-500 inline-block">
                  <Link href={`/sentence/${word.sortKey}`}>
                    {i + 1 + '.' + word.sortKey}
                  </Link>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Letter;
