import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import axios from 'axios';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { Sha256 } from '@aws-crypto/sha256-js';

import styles from '../styles/index.module.css';

// create signing key
const sigv4 = new SignatureV4({
  service: 'lambda',
  region: process.env.NEXT_PUBLIC_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_LAMBDA_CALLER_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_LAMBDA_CALLER_SECRET!,
  },
  sha256: Sha256,
});

const lambdaUrl = process.env.NEXT_PUBLIC_LAMBDA_URL!;
const lambdaUrlObject = new URL(lambdaUrl);

const Home: NextPage = () => {
  const [word, setWord] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isCreateSuccess, setIsCreateSuccess] = useState<boolean | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createdLink, setCreatedLink] = useState('');
  const sentencesInitial = Array.from(Array(6).keys()).map((key) => {
    return {
      sentence: '',
      styledSentence: '',
    };
  });

  const [sentences, setSentences] = useState(sentencesInitial);

  const handleCreate = async () => {
    if (!word) return setErrorMessage('word is emtpy');

    setIsCreateSuccess(null);
    setErrorMessage('');

    const sentencesSanitized = [];

    let styledSentenceEmpty = false;
    for (let i = 0; i < sentences.length; i++) {
      // continue if current sentence is empty
      if (!sentences[i].sentence) continue;
      // check if there is any sentence object that doesn't have styledSentence
      if (!sentences[i].styledSentence) {
        styledSentenceEmpty = true;
        break;
      }
      if (!/(\.|!|\?)$/.test(sentences[i].sentence)) {
        return setErrorMessage('there is sentence without punctuation mark');
      }
      sentencesSanitized.push(sentences[i]);
    }
    if (styledSentenceEmpty)
      return setErrorMessage('there is empty styledSentence');
    if (!sentencesSanitized.length)
      return setErrorMessage('sentencesSanitized length is zero');

    const body = JSON.stringify({
      word: word.trim().toLowerCase(),
      sentences: sentencesSanitized,
    });

    setIsCreating(true);
    // sign the request
    const signedRequest = await sigv4.sign({
      method: 'POST',
      hostname: lambdaUrlObject.host,
      path: lambdaUrlObject.pathname,
      protocol: lambdaUrlObject.protocol,
      headers: {
        'Content-Type': 'application/json',
        host: lambdaUrlObject.hostname, // compulsory
      },
      body,
    });

    // delete host header to get rid of cors error
    delete signedRequest.headers.host;

    try {
      const { data, status } = await axios({
        url: lambdaUrl,
        method: 'POST',
        headers: signedRequest.headers,
        data: body, // axios holds body on data prop
      });
      setIsCreateSuccess(true);
      setCreatedLink(
        `https://insentence.net/sentence/${encodeURIComponent(
          word.toLocaleLowerCase().trim()
        )}`
      );
      setSentences(sentencesInitial);
      setWord('');
    } catch (error) {
      console.log('create call failed', error);
      setIsCreateSuccess(false);
    }
    setIsCreating(false);
  };
  const handleWordChange = (e) => {
    setWord(e.target.value);
  };
  const handleSentenceChange = (arrIndex: number, e) => {
    // console.log(arrIndex, e.target.value);
    setSentences((previous) => {
      const newRefSentence = [...previous];
      newRefSentence[arrIndex] = {
        sentence: e.target.value,
        styledSentence: '',
      };
      return newRefSentence;
    });
  };

  const handleKeydown = (e) => {
    if (e.ctrlKey && e.key == 'b') {
      let selectedText = window.getSelection()?.toString().trim();
      console.log('selectedText', selectedText);

      console.log('selectedText.length', selectedText?.length);

      const sentence = e.target.value;
      const sentenceIndex = e.target.dataset.sentenceIndex;
      // console.log('sentenceIndex', sentenceIndex);

      // selected text index inside the sentence
      const selectedTextIndex = sentence.indexOf(selectedText);

      // make bold selected text
      const beforeSelected = sentence.slice(0, selectedTextIndex);
      // console.log('beforeSelected', beforeSelected);

      const afterSelected = sentence.slice(
        selectedTextIndex + selectedText?.length
      );
      // console.log('afterSelected', afterSelected);

      const selectedTextBold = `<b>${selectedText}</b>`;

      const styledSentence = `${beforeSelected}${selectedTextBold}${afterSelected}`;

      setSentences((previous) => {
        const newRef = [...previous];
        newRef[sentenceIndex].styledSentence = styledSentence;
        return newRef;
      });
    }
  };

  useEffect(() => {}, [sentences]);

  return (
    <>
      <div className=' ml-4 mt-4'>
        <div className='flex flex-col gap-4 '>
          <div>
            <label htmlFor='word'>WORD:</label> <br></br>
            <input
              type='text'
              name='word'
              id='word'
              className='border pl-2 text-black'
              onChange={handleWordChange}
              value={word}
            />
          </div>
          <div className={`space-y-2 ${styles.bold_underline}`}>
            <label htmlFor='sentences'>SENTENCES:</label>
            {sentences.map(({ sentence, styledSentence }, i) => {
              return (
                <div key={i} onKeyDown={handleKeydown}>
                  <div className='flex flex-row gap-2'>
                    <label className='flex-shrink-0'>{i}.</label>
                    <textarea
                      cols={100}
                      rows={4}
                      className='border pl-2 text-black leading-5  flex-1'
                      data-sentence-index={i}
                      onChange={(e) => handleSentenceChange(i, e)}
                      value={sentence}
                    ></textarea>

                    <div
                      dangerouslySetInnerHTML={{ __html: styledSentence }}
                      className='flex-1'
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <div className='text-red-600 h-6'>
              {errorMessage && errorMessage}
            </div>
            <button
              className={`px-4 py-2 border  font-bold text-white rounded-md ${
                isCreating ? 'bg-gray-600' : 'bg-green-600'
              } `}
              onClick={handleCreate}
              disabled={isCreating}
            >
              CREATE
            </button>

            {isCreateSuccess === true && (
              <span className='text-green-600'>created!</span>
            )}
            {isCreateSuccess === false && (
              <span className='text-red-600'>failed!</span>
            )}
            <p>
              {createdLink && (
                <a href={createdLink} target='_blank' className='text-blue-400'>
                  LINK
                </a>
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
