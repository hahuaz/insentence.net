import React, { useEffect, useState } from 'react';
import { default as cs } from 'classnames';
import Link from 'next/link';
import BeatLoader from 'react-spinners/ClipLoader';
import OutsideClickHandler from 'react-outside-click-handler';

function Navbar() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (!query) return;
    setIsFocused(true);
    if (searchResults.length) setSearchResults([]);
    const controller = new AbortController();

    setIsSearching(true);
    const timeout = setTimeout(async () => {
      try {
        const getData = async () => {
          const response = await fetch(`${BACKEND_URL}search?q=${query}`, {
            signal: controller.signal,
          });
          if (response.status === 200) {
            const { words } = await response.json();
            setSearchResults(words);
            setIsSearching(false);
          }
        };
        getData();
      } catch (error) {
        console.log(error);
      }
    }, 1000);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  return (
    <div className='pt-5 mb-5 sticky top-0 z-50 bg-white'>
      <div
        className='max-w-screen-md mx-auto rounded-lg px-3 py-4 bg-zinc-100   '
        style={{ boxShadow: 'rgb(0 0 0 / 30%) 0px 0px 30px -1px' }}
      >
        <div className='flex justify-between items-center'>
          <div>
            <Link href={'/'}>
              <a>
                <img
                  width={108}
                  height={32}
                  src='/logo.png'
                  alt='website logo'
                />
              </a>
            </Link>
          </div>
          <div className='relative'>
            <div
              className={cs(
                'flex items-center h-10 rounded-xl bg-white pl-2 border-2 border-transparent ',
                {
                  ['border-black']: isFocused,
                }
              )}
              style={{
                boxShadow:
                  'rgb(65 65 65 / 12%) 0px 3px 10px 1px, rgb(65 65 65 / 12%) 0px 3px 10px 1px',
              }}
            >
              <span
                className={cs('material-symbols-outlined ', {
                  ['text-black']: isFocused,
                  ['text-stone-500']: !isFocused,
                })}
              >
                search
              </span>
              <input
                type='text'
                name='word'
                id='search-word'
                placeholder='Search word...'
                maxLength={25}
                onChange={(e) => setQuery(e.target.value.toLowerCase())}
                value={query}
                className='pl-2 focus:border-none focus:outline-none w-60 '
                onFocus={() => setIsFocused(true)}
              />
            </div>
            {isFocused && (
              <OutsideClickHandler
                onOutsideClick={(e) => {
                  setIsFocused(false);
                }}
              >
                <div className='search-results absolute bg-white left-0 right-0 shadow-neutral-400 shadow-md rounded-md'>
                  {isSearching && (
                    <div className='flex py-4 justify-center'>
                      <BeatLoader
                        color={'#22c55e'}
                        loading={true}
                        // cssOverride={override}
                        size={23}
                        aria-label='Loading Spinner'
                        data-testid='loader'
                      />
                    </div>
                  )}
                  {!isSearching && searchResults.length > 0 && (
                    <div className='flex flex-col gap-4 py-4'>
                      {searchResults.map((result, i) => (
                        <span key={i} className=' px-4 inline-block'>
                          <Link href={`/sentence/${result}`}>
                            <a
                              className=' text-blue-500 hover:underline cursor-pointer'
                              onClick={() => setIsFocused(false)}
                            >
                              {result}
                            </a>
                          </Link>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </OutsideClickHandler>
            )}
          </div>

          <div>
            <ul className='flex text-sm font-display font-semibold  '>
              <Link href='/letter/a'>
                <a className='py-1.5 px-3.5 rounded-2xl hover:bg-zinc-300 '>
                  Letters
                </a>
              </Link>
              {/* TODO implement random */}
              {/* <Link href="/">
                <a className="py-1.5 px-3.5 rounded-3xl hover:bg-zinc-300">
                  Random
                </a>
              </Link> */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
