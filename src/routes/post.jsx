import { useLoaderData, Link, useNavigate, useOutletContext } from 'react-router-dom';
import { MdKeyboardBackspace } from 'react-icons/md';
import BackgroundImage2 from './../assets/bg-2.jpg';
import { useState, useRef, useEffect } from 'react';
// import Loading from '../components/loading';
// import Error from '../components/error';
import { SubmitButton } from '../components/button';
import axios from 'axios';
import CommentComponent from '../components/comment-component';
import PostComponent from '../components/post-component';

export async function loader({ params }) {
  const id = params.postid;
  return { id };
}

export async function action() {
  return null;
}

export default function Post() {
  const navigate = useNavigate();

  // keep track of textarea so we don't have to search dom tree each time submit
  const contentRef = useRef(null);

  // outlet context states
  const { blogPosts, loginState } = useOutletContext();

  // extract id to find right post
  const { id } = useLoaderData();
  const post = blogPosts[blogPosts.findIndex((p) => p.id === id)];
  // console.log(post);

  // store fetched comments
  const [postComments, setPostComments] = useState([]);

  // handle fetch states
  // const [isLoadingComments, setIsLoadingComments] = useState(false);
  // const [isErrorComments, setIsErrorComments] = useState(false);

  // flag to fetch comments again to keep things sync
  const [willFetchComments, setWillFetchComments] = useState(false);

  // fetch comments of this post
  useEffect(() => {
    async function tmp() {
      // setIsLoadingComments(() => true);

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

        // console.log(res.data.comments);
      } catch (err) {
        // a 404
        // setIsErrorComments(() => true);
      } finally {
        // setIsLoadingComments(() => false);
      }
    }

    // only call when post valid
    if (post) tmp();
  }, [post, loginState, willFetchComments]);

  async function handleCreateCommentSubmit(e) {
    e.preventDefault();

    // setIsLoadingComments(() => true);
    try {
      await axios({
        url: import.meta.env.VITE_API_ORIGIN + post?.url + '/comments',
        method: 'post',
        headers: {
          Authorization: `Bearer ${loginState?.token}`,
        },
        data: { content: contentRef.current.value },
      });

      contentRef.current.value = '';

      // console.log(res.data);

      // flip the switch to refetch
      setWillFetchComments((current) => !current);
    } catch (err) {
      // a 404
      // setIsErrorComments(() => true);
    } finally {
      // setIsLoadingComments(() => false);
    }
  }

  return (
    <section className="p-2 sm:p-4 text-gray-900 ">
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
          <PostComponent post={post} />

          {/* display comments */}
          <article className="sm:p-8 w-full max-w-[70ch] mx-auto rounded-lg p-4 my-4 shadow-lg text-gray-900 bg-white">
            {/* post header */}

            <header className="flex gap-2 items-center justify-between">
              <h3 className="text-warn font-bold text-xl pb-4">Comments</h3>
              <p className="italic">{postComments.length} comments</p>
            </header>

            <ul className="">
              {postComments !== undefined && postComments.length > 0 ? (
                postComments.map((comment) => {
                  // console.log(comment.id);
                  return (
                    <li key={comment.id} className="rounded-xl bg-fuchsia-50 p-4 my-4 relative">
                      <CommentComponent setWillFetchComments={setWillFetchComments} comment={comment} />
                    </li>
                  );
                })
              ) : (
                <li className="rounded-xl bg-fuchsia-50 p-4 my-4">
                  <h4 className="text-lg">No comments yet</h4>
                </li>
              )}
            </ul>

            {/* post new comment form */}
            <div className="p-4 rounded-xl bg-fuchsia-50 my-4">
              <h4 className="text-lg font-bold text-warn my-2">Post a comment</h4>

              {loginState.user !== undefined ? (
                <form onSubmit={handleCreateCommentSubmit}>
                  <textarea ref={contentRef} name="content" id="" className="w-full box-border rounded-lg p-2 my-2" placeholder="Share your thoughts" required></textarea>

                  <div className="my-2 flex gap-2 justify-end items-center">
                    <SubmitButton isDisable={false}>Post</SubmitButton>
                  </div>
                </form>
              ) : (
                <div className="my-2 flex gap-2 items-center justify-between">
                  <p className="">Please consider login to post a comment</p>
                  <Link className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white transition-all hover:scale-110 hover:shadow hover:shadow-gray-400" to="/login">
                    Login
                  </Link>
                </div>
              )}
            </div>
          </article>
        </>
      ) : (
        <div className="text-link grid place-items-center border">{/* <Loading className="text-8xl" /> */}</div>
      )}
    </section>
  );
}
