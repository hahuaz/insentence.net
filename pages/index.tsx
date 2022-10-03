import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
  const [audioUrl, setAudioUrl] = useState('');

  useEffect(() => {
    if (!audioUrl) {
      return;
    }
    const audio = new Audio(audioUrl);
    audio.play();
    return () => {
      // on destroy, pause the existing video
      audio.pause();
    };
  }, [audioUrl]);

  const exampleSentences = [
    {
      id: '0',
      word: 'bet',
      sentence: 'I bet they were good.',
      audioUrl:
        'https://insentences-tryout.s3.us-west-2.amazonaws.com/bet/.b0cbd044-3b07-423a-b870-94410bd0cb87.mp3',
    },
    {
      id: '1',
      word: 'bet',
      sentence: 'I bet you had a great time there.',
      audioUrl:
        'https://insentences-tryout.s3.us-west-2.amazonaws.com/bet/.ebf1b94b-bc06-4975-97f2-a5131013e5dd.mp3',
    },
    {
      id: '2',
      word: 'bet',
      sentence: 'Look at this place, I bet they have something nice to eat.',
      audioUrl:
        'https://insentences-tryout.s3.us-west-2.amazonaws.com/bet/.688fe955-d8fc-4ca4-9061-978063febd38.mp3',
    },
  ];

  function togglePlay(audioUrlEvent: string) {
    if (audioUrlEvent === audioUrl) {
      setAudioUrl('');
    } else {
      setAudioUrl(audioUrlEvent);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <main className="">
        <div className="">
          <ul className="list-decimal">
            {exampleSentences.map((example, _i) => {
              return (
                <li key={example.id}>
                  {example.sentence}{' '}
                  <span onClick={() => togglePlay(example.audioUrl)}>play</span>
                </li>
              );
            })}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Home;
