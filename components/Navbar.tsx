import React, { useState } from 'react';
import { default as cs } from 'classnames';
import Link from 'next/link';

function Navbar() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="pt-5 mb-5 sticky top-0 z-50 bg-white">
      <div
        className="max-w-screen-md mx-auto rounded-lg px-3 py-4 bg-zinc-100   "
        style={{ boxShadow: 'rgb(0 0 0 / 30%) 0px 0px 30px -1px' }}
      >
        <div className="flex justify-between items-center">
          <div>
            <Link href={'/'}>
              <a>
                <img
                  width={108}
                  height={32}
                  src="/logo.png"
                  alt="website logo"
                />
              </a>
            </Link>
          </div>
          {/* TODO activate search bar after implementing enough word into db */}
          {/* <div
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
              type="text"
              name="word"
              id="search-word"
              placeholder="Search word..."
              maxLength={25}
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              className="pl-2 focus:border-none focus:outline-none w-60 "
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div> */}
          <div>
            <ul className="flex text-sm font-display font-semibold  ">
              <Link href="/letter/a">
                <a className="py-1.5 px-3.5 rounded-2xl hover:bg-zinc-300 ">
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
