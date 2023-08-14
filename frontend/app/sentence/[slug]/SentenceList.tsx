"use client";

import React, { useState, useEffect, useCallback } from "react";

import { default as cs } from "classnames";

export default function SentenceItem({ sentences }) {
  const [playingKey, setPlayingKey] = useState(null);
  const [playingAudio, setPlayingAudio] = useState<HTMLAudioElement | null>(
    null
  );

  const handleEnded = useCallback(() => {
    setPlayingAudio(null);
    setPlayingKey(null);
  }, []);

  const handlePlay = (clickedSentence: any) => {
    const { sortKey: clickedKey } = clickedSentence;
    // pause and reset state
    playingAudio && playingAudio.pause();
    setPlayingAudio(null);
    setPlayingKey(null);

    /**
     * if active button clicked, user intent to pause audio.
     * return withot starting new
     */
    if (clickedKey === playingKey) {
      return;
    } else {
      setPlayingKey(clickedKey);

      /**
       * you don't need to keep audio element in memory to prevent request on replay,
       * since browser will keep it in disk cache for a while.
       */
      const audioElement = new Audio(
        `https://cdn.insentence.net/${clickedKey}`
      );
      audioElement.addEventListener("ended", handleEnded);
      audioElement.play();
      setPlayingAudio(audioElement);
    }
  };

  useEffect(() => {
    // remove the event listener on unmount or dependency change
    return () => {
      playingAudio?.removeEventListener("ended", handleEnded); // use memorized callback
    };
  }, [playingAudio, handleEnded]);

  return (
    <ul className=" list-decimal list-inside my-2 ">
      {sentences.map((sentence) => {
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
                onClick={() => navigator.clipboard.writeText(sentence.sentence)}
              >
                <span className="material-symbols-outlined text-xl font-thin text-cgray active:text-corange ">
                  content_copy
                </span>
              </button>
              <button onClick={() => handlePlay(sentence)}>
                <span
                  className={cs(
                    "material-symbols-outlined icon-volume-up text-xl font-thin ",
                    {
                      ["text-corange"]: playingKey === sentence.sortKey,
                    }
                  )}
                >
                  volume_up
                </span>
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
