import React, { useState } from 'react';
import classNames from 'classnames';

function Navbar() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className="max-w-screen-md mx-auto rounded-lg my-8 px-3 py-4 bg-stone-100 "
      style={{ boxShadow: 'rgb(0 0 0 / 30%) 0px 0px 30px -1px' }}
    >
      <div className="flex justify-between items-center">
        <div>LOGO</div>

        <div
          className={classNames(
            'flex items-center h-10 rounded-xl bg-white pl-2 ',
            {
              ['border-2']: isFocused,
            }
          )}
          style={{
            boxShadow:
              'rgb(65 65 65 / 12%) 0px 3px 10px 1px, rgb(65 65 65 / 12%) 0px 3px 10px 1px',
          }}
        >
          <span className="material-symbols-outlined text-stone-500">
            search
          </span>
          <input
            type="text"
            name="word"
            id="search-word"
            placeholder="Search word..."
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            className="pl-2 focus:border-none focus:outline-none w-60 "
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
        <span></span>
        <div>
          <ul className="flex gap-5">
            <li>LETTERS</li>
            <li>RANDOM</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
