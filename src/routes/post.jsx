import { useLoaderData, Link, Form, useNavigate, useOutletContext } from 'react-router-dom';
import { MdKeyboardBackspace } from 'react-icons/md';
import BackgroundImage2 from './../assets/bg-2.jpg';
import { useState, useEffect } from 'react';

export async function loader({ params }) {
  const id = params.postid;
  return { id };
}

export async function action() {
  return null;
}

export default function Post() {
  const navigate = useNavigate();
  const { id } = useLoaderData();
  const { blogPosts } = useOutletContext();
  const post = blogPosts[blogPosts.findIndex((p) => p.id === id)];

  // fetch comments of this post
  useEffect(() => {
    async function tmp() {
      //
    }
    tmp();
  }, [id]);

  // in case user go straight to this link before Layout have time to fetch posts
  return post !== undefined ? (
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

      <article className="p-2 sm:p-4 w-full max-w-[70ch] mx-auto my-8 rounded-lg">
        <div className="p-4 my-8 shadow-lg text-gray-900 rounded-md bg-white" key={post.id}>
          {/* post header */}
          <header className="">
            <h3 className="text-warn font-bold text-2xl pb-4">{post.title.charAt(0).toUpperCase() + post.title.slice(1)}</h3>
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
        </div>
      </article>
    </section>
  ) : (
    <div>Post not found!</div>
  );
}
