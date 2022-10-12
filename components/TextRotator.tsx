import React, { useEffect } from 'react';

function animateLetterOut(cw, i) {
  setTimeout(function () {
    cw[i].className = 'letter out';
  }, i * 80);
}

function animateLetterIn(nw, i) {
  setTimeout(function () {
    nw[i].className = 'letter in';
  }, 340 + i * 80);
}

const TextRotator = () => {
  useEffect(() => {
    const WORDS = document.querySelectorAll('.word');

    const lettersPerWord: Array<any> = [];
    WORDS.forEach((word) => {
      const letters = word.querySelectorAll('.letter');
      lettersPerWord.push(letters);
    });
    console.log('lettersPerWord', lettersPerWord);

    let currentWord = 0;
    function changeWord() {
      const cw = lettersPerWord[currentWord];
      const nw =
        currentWord == lettersPerWord.length - 1
          ? lettersPerWord[0]
          : lettersPerWord[currentWord + 1];

      for (let i = 0; i < cw.length; i++) {
        animateLetterOut(cw, i);
      }

      for (let i = 0; i < nw.length; i++) {
        nw[i].className = 'letter behind';
        nw[0].parentElement.style.opacity = 1;
        animateLetterIn(nw, i);
      }

      currentWord =
        currentWord == lettersPerWord.length - 1 ? 0 : currentWord + 1;
    }
    changeWord();

    const intervalId = setInterval(changeWord, 4000);

    return () => {
      clearInterval(intervalId);
    };
  });

  const words = ['ABC', 'DEF', 'GLM'];
  const splittedWords: Array<any> = [];

  // split letters
  let isItFirstWord = true;
  words.forEach((wordContent) => {
    // create letters span from word
    const letters = [];
    for (let i = 0; i < wordContent.length; i++) {
      const letter = <span className="letter">{wordContent.charAt(i)}</span>;
      letters.push(letter);
    }

    const word = (
      <span className="word" style={isItFirstWord ? { opacity: 1 } : {}}>
        {letters.map((letterSpan) => letterSpan)}
      </span>
    );
    isItFirstWord = false;

    splittedWords.push(word);
  });
  console.log(splittedWords);

  return (
    <div className="text">
      <p>I Love</p>
      <p>{splittedWords.map((e) => e)}</p>
    </div>
  );
};

export default TextRotator;
