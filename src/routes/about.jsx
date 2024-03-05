export default function About() {
  return (
    <section className="mx-auto my-12 p-4 max-w-[66ch] text-slate-700">
      <header className="">
        <h2 className="text-4xl font-bold">About us</h2>
      </header>
      <article className="flex flex-col gap-3 py-4">
        <p className="">
          This is not a real shopping site since we cannot receive your order but you can buy or borrow books by contact{' '}
          <a href="https://www.instagram.com/vaiquyensach/" target="_blank" rel="noopener" className="text-sky-500 underline decoration-dotted hover:decoration-solid">
            @Vaiquyensach
          </a>{' '}
          on{' '}
          <a href="https://www.instagram.com/" target="_blank" rel="noopener" className="text-sky-500 underline decoration-dotted hover:decoration-solid">
            Instagram
          </a>
        </p>
        <p className="">
          <a href="https://github.com/minhhoccode111/shopping-cart-top" target="_blank" rel="noopener" className="text-sky-500 underline decoration-dotted hover:decoration-solid">
            This project
          </a>{' '}
          is made with <span className="text-red-500">love</span> by{' '}
          <a href="https://github.com/minhhoccode111" target="_blank" rel="noopener" className="text-sky-500 underline decoration-dotted hover:decoration-solid">
            minhhoccode111
          </a>
          .
        </p>
      </article>
    </section>
  );
}
