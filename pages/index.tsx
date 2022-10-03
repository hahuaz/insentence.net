import { useState, useEffect, useCallback } from 'react';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [clickedId, setClickedId] = useState('');

  const handlePauseEvent = useCallback(() => {
    console.log('pause handler did run');
    setClickedId('');
  }, []);

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

  useEffect(() => {
    if (!clickedId) return;
    console.log('clickedId changed and its not empty string' + Date.now());

    // stop the older audio
    audio ? audio.pause() : '';
    setAudio(null);

    const sentence = exampleSentences.find(
      (sentence) => clickedId === sentence.id
    );
    const audioElement = new Audio(sentence.audioUrl);
    audioElement.addEventListener('pause', handlePauseEvent);
    setAudio(audioElement);
    audioElement.play();

    return () => {
      audioElement.removeEventListener('pause', handlePauseEvent);
    };
  }, [clickedId]);

  const handlePlayClick = (exampleId: string) => {
    // if same button clicked pause the playing audio and reset the state
    if (exampleId === clickedId) {
      audio ? audio.pause() : '';
      setAudio(null);
      return setClickedId('');
    }
    return setClickedId(exampleId);
  };

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
                    className={`${clickedId === example.id ? 'play' : ''}`}
                    onClick={() => handlePlayClick(example.id)}
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
