import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

export default function Signup() {
  // return a function let us navigate manually
  const navigate = useNavigate();

  const [confirmPasswordValidationState, setConfirmPasswordValidationState] = useState(true);

  const [passwordState, setPasswordState] = useState('');

  const [confirmPasswordState, setConfirmPasswordState] = useState('');

  function handleConfirmPasswordMatch() {
    if (passwordState === confirmPasswordState) setConfirmPasswordValidationState(true);
    else setConfirmPasswordValidationState(false);
  }

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
        <h1 className="text-2xl font-bold sm:text-3xl">Signup</h1>

        <p className="mt-4 text-gray-500">
          Want to join the conversation? Signing up is quick and free! By creating an account, you&apos;ll be able to leave comments on our blog posts, share your thoughts, and engage with other
          readers. Let&apos;s build a vibrant community together!
        </p>
      </div>

      <form
        onSubmit={(e) => {
          // handle submit manually
          e.preventDefault();

          console.log(e);

          navigate(-1);
        }}
        className="mx-auto mb-0 mt-8 max-w-md space-y-12"
      >
        <div className="mt-10">
          <label htmlFor="fullname" className="sr-only">
            Fullname
          </label>

          <div className="relative">
            <input
              name="fullname"
              id="fullname"
              type="text"
              className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm peer"
              placeholder="Enter fullname"
              minLength={'1'}
              maxLength={'50'}
              required
            />

            <span className="hidden text-danger peer-invalid:block absolute bottom-full m-1 z-10 text-xs">*Fullname must not be empty.</span>
          </div>
        </div>

        <div className="mt-10">
          <label htmlFor="username" className="sr-only">
            Username
          </label>

          <div className="relative">
            <input name="username" id="username" type="email" className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm peer" placeholder="Enter username" minLength={'8'} required />

            <span className="hidden text-danger peer-invalid:block absolute bottom-full m-1 z-10 text-xs">*Username must be a valid email.</span>

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
            <input
              name="password"
              id="password"
              type="password"
              className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm peer"
              placeholder="Enter password"
              minLength={'8'}
              maxLength={'32'}
              // at least 1 uppercase, 1 lowercase, 1 number, 1 special char
              pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$"
              required
              value={passwordState}
              onChange={(e) => {
                setPasswordState(e.target.value);
                handleConfirmPasswordMatch();
              }}
            />

            <span className="hidden text-danger peer-invalid:block absolute bottom-full m-1 z-10 text-xs">*Password must contain uppercase, lowercase, number, special character.</span>

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

        <div className="">
          <label htmlFor="confirm-password" className="sr-only">
            Confirm password
          </label>

          <div className="relative">
            <input
              name="confirm-password"
              id="confirm-password"
              type="password"
              className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
              placeholder="Confirm password"
              minLength={'8'}
              maxLength={'32'}
              required
              value={confirmPasswordState}
              onChange={(e) => {
                setConfirmPasswordState(e.target.value);
                handleConfirmPasswordMatch();
              }}
            />

            <span className={(confirmPasswordValidationState ? 'hidden ' : 'block ') + 'text-danger absolute bottom-full m-1 z-10 text-xs'}>*Confirm password does not match.</span>

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
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <Link className="underline text-link" to="/signup">
              Log in
            </Link>{' '}
            now
          </p>

          <button type="submit" className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white transition-all hover:scale-110 hover:shadow hover:shadow-gray-400">
            Sign up
          </button>
        </div>
      </form>
    </section>
  );
}
