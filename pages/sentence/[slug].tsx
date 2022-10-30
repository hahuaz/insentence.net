import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { default as cs } from 'classnames';

import type { NextPage } from 'next';

const Sentence: NextPage = () => {
  const router = useRouter();
  const { slug: word } = router.query;

  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [clickedId, setClickedId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sentences, setSentences] = useState<any>(null);

  const BACKEND_URL =
    'https://0rp9uoaexh.execute-api.us-east-1.amazonaws.com/prod/';

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
        // console.log(sentences);
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
    // console.log('pause handler did run');
    setClickedId('');
  }, []);

  useEffect(() => {
    if (!clickedId) return;
    // console.log('clickedId changed and its not empty string' + Date.now());

    // stop the older audio
    audio ? audio.pause() : '';
    setAudio(null);

    const sentence = sentences.find(
      (sentence) => clickedId === sentence.sortKey
    );
    const audioElement = new Audio(
      `https://cdn.insentence.net/${sentence.sortKey}`
    );
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
    <>
      <Head>
        <title>
          {word
            ? `${word[0].toUpperCase()}${word.slice(1)} | InSentence.net`
            : 'InSentence.net | Practice English'}
        </title>
        <meta
          content={`Examples of ${word} in sentence.`}
          name="description"
        ></meta>
      </Head>
      ;
      <div className="max-w-screen-md mx-auto w-full mb-auto mt-6 bg-zinc-100 px-4 py-2 rounded-2xl">
        <p className="flex gap-x-1 items-center ml-3">
          <span className="material-symbols-outlined text-2xl mt-1 text-black">
            menu_book
          </span>
          <span className="text-cblue text-xl ml-1 italic ">
            &ldquo;
            <span className="font-semibold font-display ">{word}</span>
            &rdquo;
          </span>
        </p>

        <ul className=" list-decimal list-inside my-2 ">
          {sentences
            ? sentences.map((sentence, _i) => {
                return (
                  <li
                    key={sentence.sortKey}
                    className="my-3 px-3 pt-3 pb-2  rounded-2xl shadow-md bg-white"
                  >
                    <span
                      dangerouslySetInnerHTML={{
                        __html: sentence.styledSentence,
                      }}
                    ></span>
                    <div className="ml-4 space-x-2 leading-none  ">
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(sentence.sentence)
                        }
                      >
                        <span className="material-symbols-outlined text-xl font-thin text-cgray active:text-corange ">
                          content_copy
                        </span>
                      </button>
                      <button onClick={() => handlePlayClick(sentence.sortKey)}>
                        <span
                          className={cs(
                            'material-symbols-outlined icon-volume-up text-xl font-thin ',
                            {
                              ['text-corange']: clickedId === sentence.sortKey,
                            }
                          )}
                        >
                          volume_up
                        </span>
                      </button>
                    </div>
                  </li>
                );
              })
            : 'Loading...'}
        </ul>
      </div>
    </>
  );
};

export default Sentence;
