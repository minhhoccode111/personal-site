import PropTypes from 'prop-types';
import { useState } from 'react';

export default function Comment({ comment }) {
  const [isEditing, setIsEditing] = useState();

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

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
};
