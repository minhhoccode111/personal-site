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
          Currently, only the <code className="">/Blog</code>, <code className="">/Signup</code>, and <code>/Login</code> routes are functional. These routes showcase the{' '}
          <a href="https://github.com/minhhoccode111/blog-back" target="_blank" rel="noopener" className="text-link underline decoration-dotted hover:decoration-solid">
            Project Blog API
          </a>{' '}
          developed for{' '}
          <a href="https://www.theodinproject.com/lessons/nodejs-blog-api" target="_blank" rel="noopener" className="text-link underline decoration-dotted hover:decoration-solid">
            The Odin Project&apos;s NodeJS course
          </a>
          . Additional features are still under development.
        </p>

        <p className="">This project&apos;s backend uses free tier hosting on Glitch, which can cause significant delays in the server&apos;s response time for API requests or data fetching.</p>
      </article>
    </section>
  );
}
