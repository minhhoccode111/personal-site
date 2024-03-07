import { IoIosTrash, IoIosCheckmark, IoIosClose, IoIosCreate } from 'react-icons/io';
import { useOutletContext } from 'react-router-dom';
import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
// import Loading from './loading';
// import Error from './error';

export default function CommentComponent({ comment, setWillFetchComments }) {
  const { loginState } = useOutletContext();

  // modified states of comment
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // const [isCommentLoading, setIsCommentLoading] = useState(false);
  // const [isCommentError, setIsCommentError] = useState(false);

  const contentRef = useRef(null);

  async function handleEditCommentSubmit(e) {
    e.preventDefault();

    try {
      await axios({
        method: 'put',
        url: import.meta.env.VITE_API_ORIGIN + comment.url,
        headers: {
          Authorization: `Bearer ${loginState.token}`,
        },
        data: {
          content: contentRef.current.value,
        },
      });

      contentRef.current.value = '';

      // console.log(res.data);

      // flip the switch to refetch
      setWillFetchComments((current) => !current);
    } catch (err) {
      console.log(err.response);

      // setIsCommentError(true);
    } finally {
      setIsEditing(false);
      // setIsCommentLoading(false);
    }
  }

  async function handleDeleteCommentSubmit(e) {
    e.preventDefault();

    // setIsCommentLoading(true);

    // console.log(import.meta.env.VITE_API_ORIGIN + comment.url);

    try {
      await axios({
        method: 'delete',
        url: import.meta.env.VITE_API_ORIGIN + comment.url,
        headers: {
          Authorization: `Bearer ${loginState.token}`,
        },
      });

      // console.log(res.data);

      // flip the switch to refetch
      setWillFetchComments((current) => !current);
    } catch (err) {
      console.log(err.response);

      // setIsCommentError(true);
    } finally {
      // setIsCommentLoading(false);
    }
  }

  let jsx;

  if (isEditing) {
    jsx = (
      <>
        <p className="">Edit this comment?</p>

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
        <p className="">Delete this comment?</p>

        {/* close confirm form */}
        <button className="text-danger" onClick={() => setIsDeleting(false)}>
          <IoIosClose className="text-6xl sm:text-2xl md:text-3xl" />
        </button>

        {/* submit delete form */}
        <form className="grid place-items-center" onSubmit={handleDeleteCommentSubmit}>
          <button type="submit" className="text-success">
            <IoIosCheckmark className="text-6xl sm:text-2xl md:text-3xl" />
          </button>
        </form>
      </>
    );
  }

  // currently not editing or deleting, usually when first load then base on user's authorization to display whether they can delete or edit a comment
  else {
    if (comment?.canEdit && comment?.canDelete) {
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
    } else if (comment?.canEdit) {
      jsx = (
        // only can edit
        <button className="text-warn" onClick={() => setIsEditing(true)}>
          <IoIosCreate className="text-6xl sm:text-2xl md:text-3xl" />
        </button>
      );
    } else if (comment?.canDelete) {
      jsx = (
        // only can delete
        <button className="text-danger" onClick={() => setIsDeleting(true)}>
          <IoIosTrash className="text-6xl sm:text-2xl md:text-3xl" />
        </button>
      );
    }
  }

  return !isEditing ? (
    // display normal when to editing
    <>
      {/* unescaped comment creator fullname */}
      <h4 className="text-lg text-link cursor-pointer hover:underline" dangerouslySetInnerHTML={{ __html: comment?.creator?.fullname }}></h4>

      {/* unescaped comment content */}
      <p className="" dangerouslySetInnerHTML={{ __html: comment?.content }}></p>

      {/* display comment's time created and time last modified */}
      <p className="text-xs italic inline-block pr-1">Created: {comment?.createdAtFormatted} </p>
      {comment.lastModified && <p className="text-xs italic inline-block"> | Edited: {comment?.lastModifiedFormatted}</p>}

      {/* delete and edit buttons or confirm and cancel button */}
      <div className="flex gap-2 items-center justify-end">{jsx}</div>
    </>
  ) : (
    // display form when editing
    <form onSubmit={handleEditCommentSubmit}>
      {/* unescaped comment creator fullname */}
      <h4 className="text-lg text-link cursor-pointer hover:underline" dangerouslySetInnerHTML={{ __html: comment?.creator?.fullname }}></h4>

      {/* replace a p tag with textarea */}
      <textarea ref={contentRef} name="content" id="" className="w-full box-border rounded-lg p-2 my-2" placeholder="Share your thoughts" required defaultValue={comment.content}></textarea>

      {/* display comment's time created and time last modified */}
      <p className="text-xs italic inline-block pr-1">Created: {comment?.createdAtFormatted} </p>
      {comment.lastModified && <p className="text-xs italic inline-block"> | Edited: {comment?.lastModifiedFormatted}</p>}

      {/* confirm and cancel buttons */}
      <div className="flex gap-2 items-center justify-end">{jsx}</div>
    </form>
  );
}

CommentComponent.propTypes = {
  comment: PropTypes.object.isRequired,
  setWillFetchComments: PropTypes.func.isRequired,
};
