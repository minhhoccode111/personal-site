export default function About() {
  return (
    <section className="mx-auto my-12 p-4 max-w-[65ch] w-full text-slate-700">
      <header className="">
        <h2 className="text-4xl font-bold">About</h2>
      </header>
      <article className="flex flex-col gap-3 py-4">
        {/* <p className="">
          This is not a real shopping site since we cannot receive your order but you can buy or borrow books by contact{' '}
          <a href="https://www.instagram.com/vaiquyensach/" target="_blank" rel="noopener" className="text-sky-500 underline decoration-dotted hover:decoration-solid">
            @Vaiquyensach
          </a>{' '}
          on{' '}
          <a href="https://www.instagram.com/" target="_blank" rel="noopener" className="text-sky-500 underline decoration-dotted hover:decoration-solid">
            Instagram
          </a>
        </p> */}
        <p className="">
          <a href="https://github.com/minhhoccode111/personal-portfolio" target="_blank" rel="noopener" className="text-link underline decoration-dotted hover:decoration-solid">
            This project
          </a>{' '}
          is made {/* with */}
          {/* <span className="text-red-500">love</span> */}
          by{' '}
          <a href="https://github.com/minhhoccode111" target="_blank" rel="noopener" className="text-sky-500 underline decoration-dotted hover:decoration-solid">
            minhhoccode111
          </a>
          .
        </p>
        <p className="">
          But only <code className="">/Blog</code> and <code className="">/Signup</code> and <code>/Login</code> are working to showcase{' '}
          <a href="https://github.com/minhhoccode111/blog-back" target="_blank" rel="noopener" className="text-link underline decoration-dotted hover:decoration-solid">
            Project Blog API
          </a>{' '}
          of{' '}
          <a href="https://www.theodinproject.com/lessons/nodejs-blog-api" target="_blank" rel="noopener" className="text-link underline decoration-dotted hover:decoration-solid">
            The Odin Project&apos;s NodeJS course
          </a>
          . Additional features are under development.
        </p>
      </article>
    </section>
  );
}
