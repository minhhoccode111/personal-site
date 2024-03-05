import { useEffect, useState } from 'react';
import { RiArrowUpDoubleLine } from 'react-icons/ri';
import { IoBagCheckOutline } from 'react-icons/io5';
import { useFetcher, Link, useLoaderData, useSubmit, useOutletContext } from 'react-router-dom';
import BackgroundImage2 from './../assets/bg-2.jpg';

export async function loader() {
  return null;
}

export async function action() {
  return null;
}

export default function Blog() {
  // navigate with form
  const [fetcher, submit] = [useFetcher(), useSubmit()];

  // sticky search header
  const [isSticky, setIsSticky] = useState(false);

  // blog posts from Layout
  const { blogPosts } = useOutletContext();

  useEffect(() => {
    // make search bar stick to the top when start scrolling
    const stickSearch = document.getElementById('stick-search');
    const sticky = stickSearch?.offsetTop;
    const handleScroll = () => {
      if (!sticky) return;
      if (window.scrollY > sticky) setIsSticky(true);
      else setIsSticky(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <section className="">
      {/* background image */}
      <div className="fixed -z-10 top-0 left-0 w-screen h-screen bg-white overflow-hidden">
        <img src={BackgroundImage2} alt="Background image" className="object-cover border object-center h-full w-full brightness-90" />
      </div>

      {/* padding element so that the header don't seem like teleport when it sticky to top */}
      <div className={'text-transparent px-8 py-4 border' + ' ' + (isSticky ? '' : 'hidden')}>Made with love by minhhoccode111</div>
      <div
        id="stick-search"
        className={
          'flex gap-2 sm:gap-3 md:gap-4 items-end justify-center md:justify-end transition-all px-4 py-2 sm:px-8 sm:py-4 bg-white' + ' ' + (isSticky ? 'fixed top-0 left-0 right-0 z-20 shadow-xl' : '')
        }
      >
        {/* divider */}
        <div className="hidden md:block border-b-8 border-sky-500 flex-1 scale-x-150 origin-right"></div>

        {/* search field */}
        <div className="max-sm:w-1/3">
          <fetcher.Form method="get" role="search" className="">
            <label
              htmlFor="search-input"
              className="relative block rounded-md sm:rounded-lg border border-gray-200 shadow-sm focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500"
            >
              <input
                id="search-input"
                className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 sm:text-lg"
                placeholder="Search for..."
                type="search"
                name="q"
                onChange={(e) => {
                  // submit search query on type
                  submit(e.target.form);
                }}
              />

              <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:-top-1 peer-focus:text-xs peer-focus:sm:text-sm">
                Search
              </span>
            </label>
          </fetcher.Form>
        </div>

        {/* filter category */}
        <div className="">
          <fetcher.Form method="get" className="flex gap-2 sm:gap-3 md:gap-4">
            <div className="">
              <label htmlFor="filter-by" className="block text-sm font-medium text-gray-900">
                {' '}
                Category{' '}
              </label>
              <select
                name="category"
                id="filter-by"
                className="mt-1.5 w-full rounded-lg border-gray-300 bg-white border shadow-sm focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500 text-gray-700 sm:text-sm md:text-base px-2 py-1 sm:px-3 sm:py-1.5"
                // submit query on change
                onChange={(e) => {
                  submit(e.target.form);
                }}
              >
                <option value="all">All</option>
                <option value="backend">Back-end</option>
                <option value="frontend">Front-end</option>
                <option value="security">Security</option>
                <option value="database">Database</option>
                <option value="network">Network</option>
                <option value="dsa">Data Structures & Algorithms</option>
                <option value="os">Operating System</option>
              </select>
            </div>

            <div className="">
              <label htmlFor="sort-by" className="block text-sm font-medium text-gray-900">
                {' '}
                Sort{' '}
              </label>
              <select
                // submit query on change
                onChange={(e) => {
                  submit(e.target.form);
                }}
                name="sort"
                id="sort-by"
                className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm md:text-base px-2 py-1 sm:px-3 sm:py-1.5 bg-white border shadow-sm focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500 "
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="most-like">Most like</option>
                <option value="most-comment">Most comment</option>
              </select>
            </div>
          </fetcher.Form>
        </div>
      </div>

      <ul className="p-2 sm:p-4 w-full max-w-[70ch] mx-auto my-8 rounded-lg">
        {blogPosts.map((post) => {
          return (
            <li className="p-4 my-8 shadow-lg text-gray-900 rounded-md bg-white" key={post.id}>
              <Link className="block pb-4" to={post.id}>
                <h3 className="text-link font-bold text-2xl">{post.title.charAt(0).toUpperCase() + post.title.slice(1)}</h3>
              </Link>
              <div className="flex gap-2 justify-between items-center italic">
                <p className="">{post.creator.fullname}</p>
                <div className="flex gap-1 text-xs items-center justify-end">
                  <p className="">{post.createdAtFormatted}</p>

                  <p>|</p>

                  {/* calculate speed base on content's characters */}
                  <p className="">{Math.ceil(post.content.length / 5 / 238)} min read</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* a scroll to top button */}
      <div className={'fixed right-2 bottom-2 z-10' + ' ' + (isSticky ? 'block' : 'hidden')}>
        <button
          onClick={() => {
            // scroll to top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
          }}
          className="grid place-items-center w-12 h-12 bg-white border-2 border-sky-500 rounded-full hover:bg-sky-500 text-sky-500 hover:text-white transition-all"
        >
          <RiArrowUpDoubleLine className="text-4xl" />
        </button>
      </div>
    </section>
  );
}
