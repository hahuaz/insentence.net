import { alphabet } from "@/app/lib";

import SentenceList from "./SentenceList";

// Return a list of `params` to populate the [slug] dynamic segment
export const generateStaticParams = async () => {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const allWords: string[] = [];

  // await Promise.all(
  //   alphabet.map(async (letter) => {
  //     const response = await fetch(`${BACKEND_URL}word?starts-with=${letter}`);
  //     const wordList: { sortKey: string; partitionKey }[] =
  //       await response.json();

  //     wordList.forEach((wordObj): any => {
  //       allWords.push(wordObj.sortKey);
  //     });
  //   })
  // );

  async function fetchWords() {
    for (const letter of alphabet) {
      const response = await fetch(`${BACKEND_URL}word?starts-with=${letter}`);
      const wordList: { sortKey: string; partitionKey }[] =
        await response.json();

      wordList.forEach((wordObj): any => {
        allWords.push(wordObj.sortKey);
      });

      // Introduce delay between each iteration
      console.log("sleeping 1 second after ", letter);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  // Call the function to fetch words synchronously
  await fetchWords();

  return allWords.map((word) => {
    return { slug: word };
  });
};

export async function generateMetadata({ params }: any) {
  const { slug: word } = params;

  return {
    title: `Examples of '${word}' in a sentence. | InSentence.net `,
    description: `Pronunciation example of word '${word}' in sentences.`,
  };
}

const SentencePage = async ({ params }) => {
  const { slug: word } = params;

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const response = await fetch(`${BACKEND_URL}sentence?word=${word}`);
  const sentences = await response.json();
  // console.log(sentences);

  return (
    <>
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

        {/* TODO use nextjs13 loading component */}
        <SentenceList sentences={sentences} />
      </div>
    </>
  );
};

export default SentencePage;
