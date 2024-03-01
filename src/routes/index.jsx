import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { RiArrowRightDoubleLine } from 'react-icons/ri';
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';
import Loading from '../components/loading';
import Error from '../components/error';

export default function Index() {
  // state about quote
  const [flag, setFlag] = useState(0);
  const [currentQuote, setCurrentQuote] = useState('');
  const [currentAuthor, setCurrentAuthor] = useState('');

  // determine load or error state
  const [isLoadingQuote, setIsLoadingQuote] = useState(true);
  const [loadingQuoteError, setLoadingQuoteError] = useState(false);


  useEffect(() => {
    const getQuote = async () => {
      try {
        const data = await fetch('https://api.quotable.io/random', { mode: 'cors' }).then((response) => response.json());

        console.log(data.content);

        // display quote
        setCurrentQuote(data.content);

        // display author
        setCurrentAuthor(data.author);
      } catch (error) {
        console.log(error);

        // display errors (if occurs)
        setLoadingQuoteError(true);
      } finally {
        // hide loading
        setIsLoadingQuote(false);
      }
    };

    getQuote(); // TODO turn on back when finishing develop
  }, [flag]);

  return (
    <section className="flex-1 flex flex-col">
      {/* background image */}
      <div className="fixed -z-10 top-0 left-0 w-screen h-screen bg-white overflow-hidden">
        <img src="/bg-1.jpg" alt="Background image" className="object-cover border object-center h-full w-full brightness-90" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-16 sm:gap-32">
        <div className="flex flex-col gap-4 text-slate-700 p-4 sm:p-6 lg:p-8 backdrop-blur-xs rounded-xl m-4 bg-[#ffffff44]">
          {loadingQuoteError ? (
            // error
            <Error />

          ) : isLoadingQuote ? (
            // fetching
            <Loading />
          ) : (
            // display fetched data
            <>
              <h2 className="flex items-center justify-center text-2xl sm:text-4xl gap-2">
                {/* quotes left */}
                <span className="self-start">
                  <FaQuoteLeft />
                </span>

                <span className="text-center">{currentQuote}</span>

                {/* quotes right */}
                <span className="self-end">
                  <FaQuoteRight />
                </span>

              </h2>

              {/* the author */}
              <h3 className="text-2xl text-center text-slate-900 font-bold">-{currentAuthor}-</h3>
            </>
          )}
        </div>

        <div className="border-2 h-0 border-sky-500 relative self-stretch">
          <button
            className="ripper px-8 py-8 underline hover:decoration-2 underline-offset-4 flex items-center tracking-widest absolute right-1/2 translate-x-1/2 bottom-0 translate-y-1/2 z-10"
            // button to fetch new quote
            onClick={() => {
              setFlag(Math.random());
              setIsLoadingQuote(true);
              setLoadingQuoteError(false);
            }}
          >
            <span className="text-xl font-bold whitespace-nowrap">New quote</span>
          </button>
        </div>
      </div>

      <div className="flex justify-end p-4 sm:p-6 lg:p-8">
        {/* link to about section */}
        <Link className="ripper pl-8 pr-4 py-8 underline hover:decoration-2 underline-offset-4 flex items-center" to={'about'}>
          {/* about me */}
          <span className="tracking-widest text-xl font-bold mb-1">About me! </span>

          {/* arrow */}
          <span className="text-4xl">
            <RiArrowRightDoubleLine />
          </span>
        </Link>
      </div>
    </section>
  );
}
