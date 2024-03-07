import { useOutletContext } from 'react-router-dom';
import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

export default function PostComponent({ post }) {
  const { loginState } = useOutletContext();

  // keep track of 3 textarea
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const publishedRef = useRef(null);

  // modified states of post
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // handle create new post submit
  async function handleEditPostSubmit(e) {
    e.preventDefault();

    // setIsLoadingPosts(() => true);
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

      // setBlogPosts((postComments) => [res?.data?.post, ...postComments]);

      // flip the switch to refetch
      setWillFetchBlogs((current) => !current);
    } catch (err) {
      // console.log(err.response);
      // if not a 400 (data invalid) error, stop user from send request again
      // if (err.response.status !== 400) setIsErrorPosts(() => true);
    } finally {
      // setIsLoadingPosts(() => false);
    }
  }

  // handle create new post submit
  async function handleDeletePostSubmit(e) {
    e.preventDefault();

    //
  }

  return (
    // display post
    <article className="sm:p-8 w-full max-w-[70ch] mx-auto rounded-lg p-4 my-4 shadow-lg bg-white">
      {/* post header */}
      <h3
        className="text-warn font-bold text-3xl pb-4"
        // unescaped post title
        dangerouslySetInnerHTML={{
          __html: post.title.charAt(0).toUpperCase() + post.title.slice(1),
        }}
      ></h3>

      {/* info */}
      <div className="flex gap-2 justify-between items-center italic">
        {/* unescaped post creator fullname */}
        <h4 className="" dangerouslySetInnerHTML={{ __html: post.creator.fullname }}></h4>

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

      <hr className="my-4" />

      {/* post content */}
      <div className="">
        <p className="" dangerouslySetInnerHTML={{ __html: post.content }}></p>
      </div>
      <div className="p-4 rounded-xl bg-gray-100 my-4">
        <h4 className="text-lg font-bold text-link my-2">Create a new post</h4>

        {loginState?.user?.isCreator ? (
          <form onSubmit={handleEditPostSubmit}>
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
              {/* {isErrorPosts ? (
                  <SubmitButton isDisable={true}>
                    <Error />
                  </SubmitButton>
                ) : isLoadingPosts ? (
                  <SubmitButton isDisable={true}>
                    <Loading />
                  </SubmitButton>
                ) : (
                  <SubmitButton isDisable={false}>Post</SubmitButton>
                )} */}

              {/* <SubmitButton isDisable={false}>Post</SubmitButton> */}
            </div>
          </form>
        ) : (
          ''
          // <p className="">Please consider log in as creator to create a post</p>
        )}
      </div>
    </article>
  );
}

PostComponent.propTypes = {
  post: PropTypes.object.isRequired,
};
