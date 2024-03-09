import { IoIosTrash, IoIosCheckmark, IoIosClose, IoIosCreate } from 'react-icons/io';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { markdownParser, domParser } from '../methods';

export default function PostComponent({ post }) {
  // navigate after deleting a post
  const navigate = useNavigate();
  const { loginState, setWillFetchPosts } = useOutletContext();

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

    // console.log('update ', import.meta.env.VITE_API_ORIGIN + post.url);
    // console.log('with title: ', titleRef.current.value);
    // console.log('with content: ', contentRef.current.value);
    // console.log('with published', publishedRef.current.value);
    // return;

    // setIsLoadingPosts(() => true);
    try {
      await axios({
        url: import.meta.env.VITE_API_ORIGIN + post.url,
        method: 'put',
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
      // if (err.response.status !== 400) setIsErrorPosts(() => true);
    } finally {
      setIsEditing(false);
      // setIsLoadingPosts(() => false);
    }
  }

  // handle create new post submit
  async function handleDeletePostSubmit(e) {
    e.preventDefault();

    // setIsPostLoading(true);

    // console.log('delete ', import.meta.env.VITE_API_ORIGIN + post.url);
    // return;

    try {
      await axios({
        method: 'delete',
        url: import.meta.env.VITE_API_ORIGIN + post.url,
        headers: {
          Authorization: `Bearer ${loginState.token}`,
        },
      });

      // console.log(res.data);
      navigate('/blog');

      // flip the switch to refetch
      setWillFetchPosts((current) => !current);
    } catch (err) {
      console.log(err.response);

      // setIsPostError(true);
    } finally {
      // setIsPostLoading(false);
    }
  }

  let jsx;

  if (isEditing) {
    jsx = (
      <>
        <p className="">Edit this post?</p>

        {/* close confirm form */}
        <button className="text-danger" onClick={() => setIsEditing(false)}>
          <IoIosClose className="text-6xl sm:text-2xl md:text-3xl" />
        </button>

        {/* submit edit form */}
        <button type="submit" className="text-success">
          <IoIosCheckmark className="text-6xl sm:text-2xl md:text-3xl" />
        </button>
      </>
    );
  } else if (isDeleting) {
    jsx = (
      <>
        <p className="">Delete this post and comments related?</p>

        {/* close confirm form */}
        <button className="text-danger" onClick={() => setIsDeleting(false)}>
          <IoIosClose className="text-6xl sm:text-2xl md:text-3xl" />
        </button>

        {/* submit delete form */}
        <form className="grid place-items-center" onSubmit={handleDeletePostSubmit}>
          <button type="submit" className="text-success">
            <IoIosCheckmark className="text-6xl sm:text-2xl md:text-3xl" />
          </button>
        </form>
      </>
    );
  }

  // currently not editing or deleting, usually when first load then base on user's authorization to display whether they can modify a post
  else {
    if (post?.canModify) {
      jsx = (
        <>
          {/* display edit button if can edit */}
          <button className="text-warn" onClick={() => setIsEditing(true)}>
            <IoIosCreate className="text-6xl sm:text-2xl md:text-3xl" />
          </button>

          {/*  display delete button if can delete */}
          <button className="text-danger" onClick={() => setIsDeleting(true)}>
            <IoIosTrash className="text-6xl sm:text-2xl md:text-3xl" />
          </button>
        </>
      );
    }
  }

  return !isEditing ? (
    // display post
    <article className="sm:p-8 w-full max-w-[70ch] mx-auto rounded-lg p-4 my-4 shadow-lg bg-white">
      {/* post header */}
      <h3
        className="text-link font-bold text-3xl pb-4 text-center"
        // unescaped post title
        dangerouslySetInnerHTML={{
          __html: markdownParser(domParser(post?.title)),
        }}
      ></h3>

      {/* info */}
      <div className="flex gap-2 justify-between items-center italic">
        {/* unescaped post creator fullname */}
        {/* <h4 className="" dangerouslySetInnerHTML={{ __html: post.creator.fullname }}></h4> */}

        {/* don't need to use dangerouslySetInnerHTML because we are not parsing markdown */}
        <h4 className="">{domParser(post?.creator?.fullname)}</h4>

        <div className="flex gap-1 text-xs items-center justify-end">
          <p className="">{post.createdAtFormatted}</p>

          <p>|</p>

          {/* calculate read time base on content's characters */}
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
        <p
          className=""
          dangerouslySetInnerHTML={{
            // we display content with it's markdown format
            __html: markdownParser(domParser(post.content)),
          }}
        ></p>
        {/* <p className="">{markdownParser(domParser(post.content))}</p> */}
      </div>

      {/* delete and edit buttons or confirm and cancel button */}
      <div className="flex gap-2 items-center justify-end">{jsx}</div>
    </article>
  ) : (
    // edit

    <article className="sm:p-8 w-full max-w-[70ch] mx-auto rounded-lg p-4 my-4 shadow-lg bg-white">
      <div className="p-4 rounded-xl bg-gray-100 my-4">
        <h4 className="text-lg font-bold text-link my-2">Edit this post</h4>

        <form onSubmit={handleEditPostSubmit}>
          <label htmlFor="title" className="block text-sm font-medium text-gray-900">
            {' '}
            Title{' '}
          </label>
          <textarea
            ref={titleRef}
            name="title"
            id="title"
            className="w-full box-border rounded-lg p-2 my-2"
            placeholder="Title..."
            required
            // serve user what they see as default value
            defaultValue={domParser(post.title)}
          ></textarea>

          <label htmlFor="content" className="block text-sm font-medium text-gray-900">
            {' '}
            Content{' '}
          </label>
          <textarea
            ref={contentRef}
            name="content"
            id="content"
            className="w-full box-border rounded-lg p-2 my-2"
            placeholder="Content..."
            required
            // serve user what they see as default value
            defaultValue={domParser(post.content)}
          ></textarea>

          <label htmlFor="published" className="block text-sm font-medium text-gray-900">
            {' '}
            Published{' '}
          </label>
          <select
            ref={publishedRef}
            name="published"
            id="published"
            className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm p-2 bg-white"
            defaultValue={post.published ? 'true' : 'false'}
          >
            {/* if not choose then default will be false because !== 'true' */}
            <option value="">Please choose</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>

          {/* delete and edit buttons or confirm and cancel button */}
          <div className="my-2 flex gap-2 items-center justify-end">{jsx}</div>
        </form>
      </div>
    </article>
  );
}

PostComponent.propTypes = {
  post: PropTypes.object.isRequired,
};
