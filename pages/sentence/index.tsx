import { useState, useEffect } from 'react';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  const [wordList, setWordList] = useState([]);

  const BACKEND_URL =
    'https://55dijtg0pg.execute-api.us-west-2.amazonaws.com/prod/';

  useEffect(() => {
    const controller = new AbortController();
    try {
      const getData = async () => {
        const response = await fetch(`${BACKEND_URL}word`, {
          signal: controller.signal,
        });

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
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <main className="">here all the sentences...</main>
      <div>
        <ul>
          {wordList.map((word, i) => {
            return (
              <li key={i} className="list-disc text-blue-500">
                <a href={`/sentence/${word.sortKey}`}>{word.sortKey}</a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Home;
