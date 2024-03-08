import { useFetcher, Link, useSubmit, useOutletContext } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { RiArrowUpDoubleLine } from 'react-icons/ri';
import axios from 'axios';
import BackgroundImage2 from './../assets/bg-2.jpg';
import { SubmitButton } from '../components/button';
import Loading from '../components/loading';
import Error from '../components/error';
import { markdownParser, domParser } from '../methods';

export async function loader() {
  return null;
}

export async function action() {
  return null;
}

export default function Blog() {
  // navigate with form
  const [fetcher, submit] = [useFetcher(), useSubmit()];

  // keep track of 3 textarea
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const publishedRef = useRef(null);

  // sticky search header
  const [isSticky, setIsSticky] = useState(false);

  // states from layout use context
  const {
    blogPosts,
    loginState,
    isErrorPosts,
    isLoadingPosts,
    setWillFetchPosts, // toggle a flag to refetch posts
  } = useOutletContext();

  // fetch state of create post form
  const [isLoadingPostForm, setIsLoadingPostForm] = useState(false);
  const [isErrorPostForm, setIsErrorPostForm] = useState(false);

  // handle create new post submit
  async function handleCreatePostSubmit(e) {
    e.preventDefault();

    setIsLoadingPostForm(true);

    try {
      await axios({
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

      // flip the switch to refetch
      setWillFetchPosts((current) => !current);
    } catch (err) {
      // console.log(err.response);
      // if not a 400 (data invalid) error, stop user from send request again
      if (err.response.status !== 400) setIsErrorPostForm(() => true);
    } finally {
      setIsLoadingPostForm(false);
    }
  }

  // make search bar stick to the top when start scrolling
  useEffect(() => {
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

  let jsx;

  // there server error or connection error when fetching posts
  if (isErrorPosts) {
    jsx = (
      <div className="mx-auto grid place-items-center text-warn">
        <Error className="text-8xl" />
      </div>
    );
    // is fetching
  } else if (isLoadingPosts) {
    jsx = (
      <div className="mx-auto grid place-items-center text-warn">
        <Loading className="text-8xl" />
      </div>
    );
    // data available
  } else {
    jsx = (
      <ul className="">
        {blogPosts.map((post) => (
          <li className="p-4 my-8 shadow-lg text-gray-900 rounded-md bg-white" key={post.id}>
            <Link className="block pb-4" to={post.id}>
              {/* display multi line if title had \n */}
              <h3
                className="text-link font-bold text-2xl"
                dangerouslySetInnerHTML={{
                  __html: markdownParser(domParser(post?.title)),
                }}
              ></h3>
            </Link>

            <div className="flex gap-2 justify-between items-center italic">
              <p
                // unescaped user's name has "'<>, no need to handle multi line
                dangerouslySetInnerHTML={{
                  __html: post?.creator?.fullname,
                }}
                className=""
              ></p>
              <div className="flex gap-1 text-xs items-center justify-end">
                <p className="">{post.createdAtFormatted}</p>

                <p>|</p>

                {/* calculate speed base on content's characters */}
                <p className="">{Math.ceil(post.content.length / 5 / 238)} min read</p>

                {loginState?.user?.isCreator && (
                  <>
                    <p>|</p>
                    <p className="">{post.published ? 'Published' : 'Unpublished'}</p>
                  </>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="">
      {/* background image */}
      <div className="fixed -z-10 top-0 left-0 w-screen h-screen bg-white overflow-hidden">
        <img src={BackgroundImage2} alt="Background image" className="object-cover border object-center h-full w-full brightness-90" />
      </div>

      {/* padding element so that the header don't seem like teleport when it sticky to top */}
      <div className={'text-transparent px-8 py-4 border' + ' ' + (isSticky ? '' : 'hidden')}>Made with by minhhoccode111</div>
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

      {/* display each post in blogPosts and its link to navigate to view */}
      <div className="p-2 sm:p-4 w-full max-w-[70ch] mx-auto my-8 rounded-lg">
        {jsx}

        {/* create new post field */}
        <div className="p-4 rounded-xl bg-gray-100 my-4">
          <h4 className="text-lg font-bold text-link my-2">Create a new post</h4>

          {/* only creator can create posts */}
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

              {/* a button based on create new post state, stop user from sending too many requests */}
              <div className="my-2 flex gap-2 justify-end items-center">
                {isErrorPostForm ? (
                  <SubmitButton isDisable={true}>
                    <Error />
                  </SubmitButton>
                ) : isLoadingPostForm ? (
                  <SubmitButton isDisable={true}>
                    <Loading />
                  </SubmitButton>
                ) : (
                  <SubmitButton isDisable={false}>Post</SubmitButton>
                )}
              </div>
            </form>
          ) : (
            // not creator users get a placeholder text
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
