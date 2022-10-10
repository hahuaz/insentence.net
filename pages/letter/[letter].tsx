import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';

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
const Home: NextPage = () => {
  const [wordList, setWordList] = useState([]);

  const { query } = useRouter();
  const { letter } = query;

  const BACKEND_URL =
    'https://55dijtg0pg.execute-api.us-west-2.amazonaws.com/prod/';

  useEffect(() => {
    console.log('letter', letter);
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
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div>
        <ul className="flex gap-4">
          {alphabet.map((letter) => {
            return (
              <li className="cursor-pointer" key={letter}>
                <Link href={`/letter/${letter}`}>{letter.toUpperCase()}</Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <ul>
          {wordList.map((word, i) => {
            return (
              <li key={i} className="list-disc text-blue-500">
                <Link href={`/sentence/${word.sortKey}`}>{word.sortKey}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Home;
