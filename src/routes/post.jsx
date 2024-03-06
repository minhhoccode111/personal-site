import { useLoaderData, Link, Form, useNavigate, useOutletContext } from 'react-router-dom';
import { MdKeyboardBackspace } from 'react-icons/md';
import BackgroundImage2 from './../assets/bg-2.jpg';
import { useState, useEffect } from 'react';
import Loading from '../components/loading';
import Error from '../components/error';
import axios from 'axios';

export async function loader({ params }) {
  const id = params.postid;
  return { id };
}

export async function action() {
  return null;
}

export default function Post() {
  const navigate = useNavigate();

  // outlet context states
  const { blogPosts, loginState } = useOutletContext();

  // extract id to find right post
  const { id } = useLoaderData();
  const post = blogPosts[blogPosts.findIndex((p) => p.id === id)];

  // store fetched comments
  const [postComments, setPostComments] = useState([]);

  // handle fetch states
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isErrorComments, setIsErrorComments] = useState(false);

  // fetch comments of this post
  useEffect(() => {
    async function tmp() {
      setIsLoadingComments(() => true);

      try {
        // try to fetch
        const res = await axios({
          url: import.meta.env.VITE_API_ORIGIN + post?.url + '/comments',
          method: 'get',
          headers: {
            Authorization: `Bearer ${loginState?.token}`,
          },
        });

        // store data
        setPostComments(() => res?.data?.comments);

        console.log(res.data.comments);
      } catch (err) {
        // a 404
        setIsErrorComments(() => true);
      } finally {
        setIsLoadingComments(() => false);
      }
    }

    // only call when post valid
    if (post) tmp();
  }, [post, loginState]);

  return (
    <section className="p-2 sm:p-4">
      {/* background image */}
      <div className="fixed -z-10 top-0 left-0 w-screen h-screen bg-white overflow-hidden">
        <img src={BackgroundImage2} alt="Background image" className="object-cover border object-center h-full w-full brightness-90" />
      </div>

      {/* back button */}
      <div className="text-4xl">
        <button className="grid place-items-center w-12 h-12 bg-white border-2 border-sky-500 rounded-full hover:bg-sky-500 text-sky-500 hover:text-white transition-all" onClick={() => navigate(-1)}>
          <MdKeyboardBackspace />
        </button>
      </div>

      {/* in case user go straight to this link before Layout have time to fetch posts  */}
      {post !== undefined ? (
        <>
          {/* display post */}
          <article className="sm:p-8 w-full max-w-[70ch] mx-auto rounded-lg p-4 my-4 shadow-lg text-gray-900 bg-white">
            {/* post header */}
            <header className="">
              <h3 className="text-warn font-bold text-3xl pb-4">{post.title.charAt(0).toUpperCase() + post.title.slice(1)}</h3>
            </header>

            {/* info */}
            <div className="flex gap-2 justify-between items-center italic">
              <h4 className="">{post.creator.fullname}</h4>
              <div className="flex gap-1 text-xs items-center justify-end">
                <p className="">{post.createdAtFormatted}</p>

                <p>|</p>

                {/* calculate speed base on content's characters */}
                <p className="">{Math.ceil(post.content.length / 5 / 238)} min read</p>
              </div>
            </div>

            <hr className="my-4" />

            {/* post content */}
            <div className="">
              <p className="">{post.content}</p>
            </div>
          </article>

          {/* display comments */}
          <article className="sm:p-8 w-full max-w-[70ch] mx-auto rounded-lg p-4 my-4 shadow-lg text-gray-900 bg-white">
            {/* post header */}

            <header className="flex gap-2 items-center justify-between">
              <h3 className="text-warn font-bold text-xl pb-4">Comments</h3>
              <p className="italic">{postComments.length} comments</p>
            </header>

            <ul className="">
              {postComments !== undefined && postComments.length > 0 ? (
                postComments.map((comment) => (
                  <li className="rounded-xl bg-fuchsia-50 p-4 my-4" key={comment.id}>
                    <h4 className="text-lg">{comment?.creator?.fullname}</h4>
                    <p className="">{comment?.content}</p>
                    <p className="text-xs italic">{comment?.createdAtFormatted}</p>

                    {/* <div className="">No comments yet</div> */}
                  </li>
                ))
              ) : (
                <li className="rounded-xl bg-fuchsia-50 p-4 my-4">
                  <h4 className="text-lg">No comments yet</h4>
                </li>
              )}
            </ul>
          </article>
        </>
      ) : (
        <div className="text-link grid place-items-center border">
          <Loading className="text-8xl" />
        </div>
      )}
    </section>
  );
}
