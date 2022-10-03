import { useState, useEffect } from 'react';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  const [currentTarget, setCurrentTarget] = useState<HTMLElement | null>(null);
  // const [audio, setAudio] = useState<HTMLElement | null>(null);

  useEffect(() => {
    console.log(currentTarget);
    if (!currentTarget) {
      return;
    }

    const audioUrl = currentTarget.dataset.audioUrl;
    currentTarget.classList.toggle('play');
    const audio = new Audio(audioUrl);
    audio.addEventListener(
      'ended',
      () => {
        currentTarget.classList.toggle('play');
        setCurrentTarget(null);
      },
      {
        once: true,
      }
    );
    audio.play();

    // return () => {};
  }, [currentTarget]);

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

  function togglePlay(e: React.MouseEvent<HTMLElement>) {
    setCurrentTarget(e.currentTarget);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <main className="">
        <div className="">
          <ul className="list-decimal">
            {exampleSentences.map((example, _i) => {
              return (
                <li key={example.id}>
                  {example.sentence}
                  <button
                    data-id={example.id}
                    data-audio-url={example.audioUrl}
                    onClick={togglePlay}
                  >
                    <span className="material-symbols-outlined icon-volume-up text-gray-500 ">
                      volume_up
                    </span>
                  </button>
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
