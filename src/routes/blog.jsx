import { useEffect, useState, useRef } from 'react';
import { RiArrowUpDoubleLine } from 'react-icons/ri';
import { useFetcher, Link, useSubmit, useOutletContext, useNavigate } from 'react-router-dom';
import BackgroundImage2 from './../assets/bg-2.jpg';
import { SubmitButton } from '../components/button';
import PostComponent from '../components/post-component';
import axios from 'axios';
import Loading from '../components/loading';
import Error from '../components/error';

export async function loader() {
  return null;
}

export async function action() {
  return null;
}

export default function Blog() {
  // navigate with form
  const [fetcher, submit] = [useFetcher(), useSubmit()];

  const navigate = useNavigate();

  // keep track of 3 textarea
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const publishedRef = useRef(null);

  // sticky search header
  const [isSticky, setIsSticky] = useState(false);

  // blog posts from Layout
  const { blogPosts, setBlogPosts, loginState } = useOutletContext();

  // fetch states
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isErrorPosts, setIsErrorPosts] = useState(false);

  // handle create new post submit
  async function handleCreatePostSubmit(e) {
    e.preventDefault();

    setIsLoadingPosts(() => true);
    try {
      const res = await axios({
        url: import.meta.env.VITE_API_ORIGIN + '/posts',
        method: 'post',
        headers: {
          Authorization: `Bearer ${loginState?.token}`,
        },
        data: {
          title: titleRef.current.value,
          content: contentRef.current.value,
          published: publishedRef.current.value === 'true',
        },
      });

      titleRef.current.value = '';
      contentRef.current.value = '';
      publishedRef.current.value = '';

      // console.log(res.data);

      setBlogPosts((postComments) => [res?.data?.post, ...postComments]);
    } catch (err) {
      // console.log(err.response);
      // if not a 400 (data invalid) error, stop user from send request again
      if (err.response.status !== 400) setIsErrorPosts(() => true);
    } finally {
      setIsLoadingPosts(() => false);
    }
  }

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

      <div className="p-2 sm:p-4 w-full max-w-[70ch] mx-auto my-8 rounded-lg">
        <ul className="">
          {blogPosts.map((post) => {
            return <PostComponent key={post.id} post={post} />;
          })}
        </ul>

        <div className="p-4 rounded-xl bg-gray-100 my-4">
          <h4 className="text-lg font-bold text-link my-2">Create a new post</h4>

          {loginState?.user?.isCreator ? (
            <form onSubmit={handleCreatePostSubmit}>
              <label htmlFor="title" className="block text-sm font-medium text-gray-900">
                {' '}
                Title{' '}
              </label>
              <textarea ref={titleRef} name="title" id="title" className="w-full box-border rounded-lg p-2 my-2" placeholder="Title..." required></textarea>

              <label htmlFor="content" className="block text-sm font-medium text-gray-900">
                {' '}
                Content{' '}
              </label>
              <textarea ref={contentRef} name="content" id="content" className="w-full box-border rounded-lg p-2 my-2" placeholder="Content..." required></textarea>

              <label htmlFor="published" className="block text-sm font-medium text-gray-900">
                {' '}
                Published{' '}
              </label>
              <select ref={publishedRef} name="published" id="published" className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm p-2 bg-white">
                {/* if not choose then default will be false because !== 'true' */}
                <option value="">Please choose</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>

              <div className="my-2 flex gap-2 justify-end items-center">
                {isErrorPosts ? (
                  <SubmitButton isDisable={true}>
                    <Error />
                  </SubmitButton>
                ) : isLoadingPosts ? (
                  <SubmitButton isDisable={true}>
                    <Loading />
                  </SubmitButton>
                ) : (
                  <SubmitButton isDisable={false}>Post</SubmitButton>
                )}
              </div>
            </form>
          ) : (
            <p className="">Please consider log in as creator to create a post</p>
          )}
        </div>
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
