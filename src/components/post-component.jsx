import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function PostComponent({ post }) {
  return (
    <li className="p-4 my-8 shadow-lg text-gray-900 rounded-md bg-white" key={post.id}>
      <Link className="block pb-4" to={post.id}>
        <h3
          className="text-link font-bold text-2xl"
          dangerouslySetInnerHTML={{
            __html: post.title.length < 100 ? post.title.charAt(0).toUpperCase() + post.title.slice(1) : post.title.charAt(0).toUpperCase() + post.title.slice(1, 98) + '...',
          }}
        ></h3>
      </Link>
      <div className="flex gap-2 justify-between items-center italic">
        <p
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
        </div>
      </div>
    </li>
  );
}

PostComponent.propTypes = {
  post: PropTypes.object.isRequired,
};
