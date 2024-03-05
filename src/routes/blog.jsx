import { useEffect, useState } from 'react';
import { RiArrowUpDoubleLine } from 'react-icons/ri';
import { IoBagCheckOutline } from 'react-icons/io5';
import { useFetcher, Link, useLoaderData, useSubmit, useOutletContext } from 'react-router-dom';

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
      {/* padding element so that the header don't seem like teleport when it sticky to top */}
      <div className={'text-transparent px-8 py-4 border' + ' ' + (isSticky ? '' : 'hidden')}>Made with love by minhhoccode111</div>
      <div
        id="stick-search"
        className={
          'flex gap-2 sm:gap-3 md:gap-4 items-end justify-center md:justify-end transition-all px-4 py-2 sm:px-8 sm:py-4 bg-white' + ' ' + (isSticky ? 'fixed top-0 left-0 right-0 z-10 shadow-xl' : '')
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

      <div className="p-2 sm:p-4 grid grid-cols-auto-sm sm:grid-cols-auto-md md:grid-cols-auto gap-2 sm:gap-3 md:gap-4 bg-white border border-danger">
        {blogPosts.map((post) => {
          return (
            <div className="text-slate-700 flex flex-col hover:brightness-90 hover:scale-105 transition-all" key={post.id}>
              <div className="border border-gray-400 border-b-0 w-6 h-6 rounded-t-md self-end grid place-items-center bg-white">
                {post.inCart ? <IoBagCheckOutline className="text-green-700" /> : ''}
              </div>

              <Link className="block h-full bg-white" to={`post/${post.id}`}>
                <div className="flex border border-gray-400 h-full p-1 sm:p-2 gap-2 pr-2">
                  {/* <div className="w-16 sm:w-20 md:w-24 aspect-2/3">
                    <img src={post.image} alt={`${post.title} image`} className="block w-full h-full" />
                  </div> */}
                  <div className="flex-1 flex flex-col justify-between">
                    {/* <div className="">
                      <h2 className="text-sm sm:text-base md:text-lg font-bold">{title}</h2>
                      <p className="text-gray-500 max-sm:hidden text-xs sm:text-sm md:text-base text-right">{post.author}</p>
                      <p className="text-gray-500 max-sm:block hidden text-xs sm:text-sm md:text-base text-right">{shortAuthor}</p>
                      <p className="text-green-700">{book.inCart ? 'Added' : ''}</p>
                    </div> */}
                    {/* <div className="self-stretch text-right">
                      <p className="text-sm max-sm:hidden">
                        <span className="text-gray-500 decoration-2 line-through">{before} 000</span> <span className="border border-red-500 text-red-500 p-0.5 sm:p-1 rounded ml-1">-{percent}%</span>
                      </p>
                      <p className="text-sm font-bold sm:text-base md:text-lg">
                        {after} 000<span className="underline">đ</span>
                      </p>
                    </div> */}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

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
