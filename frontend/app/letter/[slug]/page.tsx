import type { NextPage } from "next";
import Link from "next/link";

import { alphabet } from "@/app/lib";

// Return a list of `params` to populate the [slug] dynamic segment
export const generateStaticParams = async () => {
  return alphabet.map((letter) => {
    return {
      slug: letter,
    };
  });
};

export async function generateMetadata({ params }: any) {
  const { slug: letter } = params;

  return {
    title: "InSentence.net | Practice English",
    description: `Words that starts with letter "${letter}".`,
  };
}

// Multiple versions of this page will be statically generated
// using the `params` returned by `generateStaticParams`
const LetterPage = async ({ params }) => {
  const { slug: letter } = params;

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const response = await fetch(`${BACKEND_URL}word?starts-with=${letter}`);
  const wordList = await response.json();

  return (
    <>
      <div className="max-w-screen-md mx-auto mb-auto">
        <ul className="flex gap-2 mt-4 mb-6">
          {alphabet.map((el) => {
            return (
              <li
                className={`px-1 border-b-4  ${
                  el === letter ? "border-corange" : "border-transparent"
                }`}
                key={el}
              >
                <Link
                  href={`/letter/${el}`}
                  prefetch={false} // prevent throttle errors on lambda@edge
                >
                  {el.toUpperCase()}
                </Link>
              </li>
            );
          })}
        </ul>
        <div>
          <div className="grid grid-cols-3 gap-y-6">
            {wordList.map((word, i) => {
              return (
                <span key={i} className=" text-blue-500 inline-block">
                  <Link
                    href={`/sentence/${word.sortKey}`}
                    prefetch={false} // prevent throttle errors on lambda@edge
                  >
                    {i + 1 + "." + word.sortKey}
                  </Link>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default LetterPage;
