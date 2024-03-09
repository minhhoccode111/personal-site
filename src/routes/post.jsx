import { useLoaderData, Link, useNavigate, useOutletContext } from 'react-router-dom';
import { MdKeyboardBackspace } from 'react-icons/md';
import BackgroundImage2 from './../assets/bg-2.jpg';
import { useState, useRef, useEffect } from 'react';
import Loading from '../components/loading';
import Error from '../components/error';
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

  // states from layout use context
  const {
    blogPosts,
    loginState,
    isErrorPosts,
    isLoadingPosts, // in case user go straight to the post
  } = useOutletContext();

  // extract id to find right post
  const { id } = useLoaderData();
  const post = blogPosts[blogPosts.findIndex((p) => p.id === id)];
  // console.log(post);

  // store fetched comments
  const [postComments, setPostComments] = useState();

  // handle get comments fetch states
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isErrorComments, setIsErrorComments] = useState(false);

  // handle post comments fetch states
  const [isLoadingCommentForm, setIsLoadingCommentForm] = useState(false);
  const [isErrorCommentForm, setIsErrorCommentForm] = useState(false);

  // flag to fetch comments again to keep things sync
  const [willFetchComments, setWillFetchComments] = useState(false);

  // fetch comments of this post
  useEffect(
    () => {
      async function tmp() {
        setIsLoadingComments(true);

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
          setPostComments(res?.data?.comments);

          // console.log(res.data.comments);
        } catch (err) {
          // a 404 because post is undefined or server error
          setIsErrorComments(true);
        } finally {
          setIsLoadingComments(false);
        }
      }

      // only call when post valid
      if (post) tmp();
    },
    // these will trigger refetch comments
    [post, loginState, willFetchComments]
  );

  async function handleCreateCommentSubmit(e) {
    e.preventDefault();

    setIsLoadingCommentForm(true);

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
      // console.log(err.response);

      // if not a data invalid stop user from sending requests
      if (err.response.status !== 400) setIsErrorCommentForm(true);
    } finally {
      setIsLoadingCommentForm(false);
    }
  }

  let commentsJsx;

  if (isErrorComments) {
    commentsJsx = (
      <div className="mx-auto grid place-items-center text-warn">
        <Error className="text-8xl" />
      </div>
    );
  } else if (isLoadingComments) {
    commentsJsx = (
      <div className="mx-auto grid place-items-center text-warn">
        <Loading className="text-8xl" />
      </div>
    );
  } else {
    commentsJsx = (
      <ul className="">
        {/* if finished fetching and postComments still undefined */}
        {!postComments ? (
          <div className="mx-auto grid place-items-center text-warn">
            <Error className="text-8xl" />
          </div>
        ) : // if not empty array
        postComments.length > 0 ? (
          // if post has comments
          postComments.map((comment) => (
            <li key={comment.id} className="rounded-xl bg-fuchsia-50 p-4 my-4 relative">
              <CommentComponent setWillFetchComments={setWillFetchComments} comment={comment} />
            </li>
          ))
        ) : (
          // if empty array
          <li className="rounded-xl bg-fuchsia-50 p-4 my-4">
            <h4 className="text-lg">No comments yet</h4>
          </li>
        )}
      </ul>
    );
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
      {/* display post */}
      {isLoadingPosts ? (
        <div className="sm:p-8 w-full max-w-[70ch] mx-auto rounded-lg p-4 my-4 shadow-lg bg-white grid place-items-center text-warn">
          <Loading className="text-8xl" />
        </div>
      ) : // post is undefined or errors while fetching posts
      !post || isErrorPosts ? (
        <div className="sm:p-8 w-full max-w-[70ch] mx-auto rounded-lg p-4 my-4 shadow-lg bg-white grid place-items-center text-warn">
          <Error className="text-8xl" />
        </div>
      ) : (
        // display post
        <PostComponent post={post} />
      )}

      {/* display comments */}
      <article className="sm:p-8 w-full max-w-[70ch] mx-auto rounded-lg p-4 my-4 shadow-lg text-gray-900 bg-white">
        {/* comments header */}
        <header className="flex gap-2 items-center justify-between">
          <h3 className="text-link font-bold text-xl pb-4">Comments</h3>

          {/* count comments */}
          <p className="italic">{postComments?.length} comments</p>
        </header>

        {/* display all post's comments */}
        {commentsJsx}

        {/* create new comment section */}
        <div className="p-4 rounded-xl bg-fuchsia-50 my-4">
          <h4 className="text-lg font-bold text-warn my-2">Post a comment</h4>

          {/* only logged in user can create comments */}
          {loginState.user !== undefined ? (
            <form onSubmit={handleCreateCommentSubmit}>
              {/* comment's content field */}
              <textarea ref={contentRef} name="content" id="" className="w-full box-border rounded-lg p-2 my-2" placeholder="Share your thoughts" required></textarea>

              {/* submit button */}
              <div className="my-2 flex gap-2 justify-end items-center">
                {/* <SubmitButton isDisable={false}>Post</SubmitButton> */}

                {isErrorCommentForm ? (
                  <SubmitButton isDisable={true}>
                    <Error />
                  </SubmitButton>
                ) : isLoadingCommentForm ? (
                  <SubmitButton isDisable={true}>
                    <Loading />
                  </SubmitButton>
                ) : (
                  <SubmitButton isDisable={false}>Post</SubmitButton>
                )}
              </div>
            </form>
          ) : (
            // not logged in users get a placeholder text
            <div className="my-2 flex gap-2 items-center justify-between">
              <p className="">Please consider login to post a comment</p>
              <Link className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white transition-all hover:scale-110 hover:shadow hover:shadow-gray-400" to="/login">
                Login
              </Link>
            </div>
          )}
        </div>
      </article>
    </section>
  );
}
