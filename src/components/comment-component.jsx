import PropTypes from 'prop-types';
import { useState } from 'react';
import { IoIosTrash, IoIosCheckmark, IoIosClose, IoIosCreate } from 'react-icons/io';
import axios from 'axios';
// import Loading from './loading';
// import Error from './error';
import { useOutletContext } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

export default function CommentComponent({ comment, setWillFetchComments }) {
  const { loginState } = useOutletContext();

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // const [isCommentLoading, setIsCommentLoading] = useState(false);
  // const [isCommentError, setIsCommentError] = useState(false);

  async function handleDeleteCommentSubmit(e) {
    e.preventDefault();

    // setIsCommentLoading(true);

    console.log(import.meta.env.VITE_API_ORIGIN + comment.url);

    try {
      const res = await axios({
        method: 'delete',
        url: import.meta.env.VITE_API_ORIGIN + comment.url,
        headers: {
          Authorization: `Bearer ${loginState.token}`,
        },
      });

      console.log(res.data);

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
    //
  } else if (isDeleting) {
    jsx = (
      <>
        <p className="">Are you sure you want to delete this comment?</p>

        <button className="text-danger" onClick={() => setIsDeleting(false)}>
          <IoIosClose className="text-6xl sm:text-2xl md:text-3xl" />
        </button>

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
          {/* display a edit button */}
          <button className="text-warn" onClick={() => setIsEditing(true)}>
            <IoIosCreate className="text-6xl sm:text-2xl md:text-3xl" />
          </button>

          {/*  display a delete button */}
          <button className="text-danger" onClick={() => setIsDeleting(true)}>
            <IoIosTrash className="text-6xl sm:text-2xl md:text-3xl" />
          </button>
        </>
      );
    } else if (comment?.canEdit) {
      jsx = (
        <button className="text-warn" onClick={() => setIsEditing(true)}>
          <IoIosCreate className="text-6xl sm:text-2xl md:text-3xl" />
        </button>
      );
    } else {
      jsx = (
        <button className="text-danger" onClick={() => setIsDeleting(true)}>
          <IoIosTrash className="text-6xl sm:text-2xl md:text-3xl" />
        </button>
      );
    }
  }

  return (
    <>
      {/* unescaped comment creator fullname */}
      <h4 className="text-lg text-link cursor-pointer hover:underline" dangerouslySetInnerHTML={{ __html: comment?.creator?.fullname }}></h4>

      {/* unescaped comment content */}
      <p className="" dangerouslySetInnerHTML={{ __html: comment?.content }}></p>
      <p className="text-xs italic">{comment?.createdAtFormatted}</p>

      {/* delete and edit buttons */}
      <div className="flex gap-2 items-center justify-end">{jsx}</div>
    </>
  );
}

CommentComponent.propTypes = {
  comment: PropTypes.object.isRequired,
  setWillFetchComments: PropTypes.func.isRequired,
};
