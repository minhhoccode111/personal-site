import PropTypes from 'prop-types';
import { useState } from 'react';

export default function CommentComponent({ comment }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <li className="rounded-xl bg-fuchsia-50 p-4 my-4">
      {/* unescaped comment creator fullname */}
      <h4 className="text-lg text-link cursor-pointer hover:underline" dangerouslySetInnerHTML={{ __html: comment?.creator?.fullname }}></h4>

      {/* unescaped comment content */}
      <p className="" dangerouslySetInnerHTML={{ __html: comment?.content }}></p>
      <p className="text-xs italic">{comment?.createdAtFormatted}</p>

      {/* <div className="">No comments yet</div> */}
    </li>
  );
}

CommentComponent.propTypes = {
  comment: PropTypes.object.isRequired,
};
