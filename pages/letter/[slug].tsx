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
  const [wordList, setWordList] = useState<any[]>([]);

  const { query } = useRouter();
  const { slug: letter } = query;

  const BACKEND_URL =
    'https://55dijtg0pg.execute-api.us-west-2.amazonaws.com/prod/';

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
        <ul className="list-decimal list-inside">
          {wordList.map((word, i) => {
            return (
              <li key={i} className=" text-blue-500">
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
