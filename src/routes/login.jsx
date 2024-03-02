import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  // for development
  // console.log(import.meta.env.VITE_API_ORIGIN); // http://localhost:3000

  /*
    Heads up! 👋
    Plugins:
    - @tailwindcss/forms
  */

  return (
    <section className="mx-auto max-w-screen-xl px-4 py-16 my-10 sm:px-6 lg:px-8 shadow-lg shadow-gray-400 rounded-xl bg-[#ffffffcc] text-slate-900">
      {/* background image */}
      <div className="fixed -z-10 top-0 left-0 w-screen h-screen bg-white overflow-hidden">
        <img src="/bg-0.jpg" alt="Background image" className="object-cover border object-center h-full w-full brightness-90" />
      </div>

      {/* header and dummy text */}
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">Login</h1>

        <p className="mt-4 text-gray-500">
          To participate in the conversation, express your opinions, and share valuable insights with others, consider logging in to comment, like, and share blog posts!
        </p>
      </div>

      <form
        onSubmit={(e) => {
          // handle submit manually
          e.preventDefault();

          console.log(e);

          navigate('/blog');
        }}
        className="mx-auto mb-0 mt-8 max-w-md space-y-4"
      >
        <div className="">
          <label htmlFor="username" className="sr-only">
            Username
          </label>

          <div className="relative">
            <input name="username" id="username" type="text" className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm" placeholder="Enter username" required />

            <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </span>
          </div>
        </div>

        <div className="">
          <label htmlFor="password" className="sr-only">
            Password
          </label>

          <div className="relative">
            <input name="password" id="password" type="password" className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm" placeholder="Enter password" required />

            <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <p>
              No account?{' '}
              <Link className="underline text-link" to="/signup">
                Sign up
              </Link>{' '}
              now
            </p>
            <p>If you just want a quick start, try asd - asd account.</p>
          </div>

          <button type="submit" className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white transition-all hover:scale-110 hover:shadow hover:shadow-gray-400">
            Log in
          </button>
        </div>
      </form>
    </section>
  );
}
