import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

import type { NextPage } from 'next';

const Home: NextPage = () => {
  const router = useRouter();
  const { word } = router.query;

  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [clickedId, setClickedId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sentences, setSentences] = useState<any>(null);

  const BACKEND_URL =
    'https://55dijtg0pg.execute-api.us-west-2.amazonaws.com/prod/';

  useEffect(() => {
    if (!word) return;
    setIsLoading(true);
    const controller = new AbortController();
    try {
      const getData = async () => {
        const response = await fetch(`${BACKEND_URL}sentence?word=${word}`, {
          signal: controller.signal,
        });

        const sentences = await response.json();
        console.log(sentences);
        setSentences(sentences);
      };
      getData();
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
    return () => {
      controller.abort();
    };
  }, [word]);

  const handlePauseEvent = useCallback(() => {
    console.log('pause handler did run');
    setClickedId('');
  }, []);

  useEffect(() => {
    if (!clickedId) return;
    console.log('clickedId changed and its not empty string' + Date.now());

    // stop the older audio
    audio ? audio.pause() : '';
    setAudio(null);

    const sentence = sentences.find(
      (sentence) => clickedId === sentence.sortKey
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
            {sentences
              ? sentences.map((sentence, _i) => {
                  return (
                    <li key={sentence.sortKey}>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: sentence.styledSentence,
                        }}
                      ></span>
                      <button
                        className={`${
                          clickedId === sentence.sortKey ? 'play' : ''
                        }`}
                        onClick={() => handlePlayClick(sentence.sortKey)}
                      >
                        <span className="material-symbols-outlined icon-volume-up text-gray-500 ">
                          volume_up
                        </span>
                      </button>
                    </li>
                  );
                })
              : 'Loading...'}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Home;
