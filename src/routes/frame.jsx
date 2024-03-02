import { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoIosCloseCircleOutline, IoIosCart, IoIosLogIn } from 'react-icons/io';
import Footer from './../components/footer';
// import { getCarts } from './../methods/carts'; // TODO change to something about login and signup and token

export function loader() {
  console.log('this loader in frame is being called no matter which route the user start');
  return null;
}

export default function Frame() {
  // location.pathname - the path of the current URL
  const { pathname } = useLocation();

  // language
  const [isVietnamese, setIsVietnamese] = useState(true);

  // hamburger menu state
  const [isShowMenu, setIsShowMenu] = useState(false);

  // TODO change to count projects and count blogs
  // count items in cart
  const [inCart, setInCart] = useState(0);

  // TODO init token
  // init count items in cart with 2 default items
  // useEffect(() => {
  //   const tmp = async () => {
  //     const carts = await getCarts();
  //     setInCart(() => carts.length);
  //   };
  //   tmp();
  // }, []);

  // TODO change to something useful
  const increase = () => setInCart((c) => c + 1);
  const decrease = () => setInCart((c) => c - 1);
  const reset = () => setInCart(() => 0);

  return (
    <>
      <header
        id="header"
        className={'flex gap-3 sm:gap-5 md:gap-7 lg:gap-9 items-center p-4 sm:p-5 md:p-6 lg:p-7 shadow-lg shadow-gray-300 text-slate-700 bg-white' + ' ' + (pathname !== '/' && 'bg-slate-50')}
        // color base on url path
      >
        {/* <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-wider flex-1 whitespace-nowrap">
          <Link to={'/'}>hoang minh</Link>
        </h1> */}

        {/* hamburger */}
        <nav className={'sm:hidden'}>
          {/* click to toggle menu */}
          <button className="mt-1 text-xl" onClick={() => setIsShowMenu(!isShowMenu)}>
            <GiHamburgerMenu />
          </button>
        </nav>

        <nav
          className={
            'flex max-sm:flex-col max-sm:gap-8 max-sm:text-4xl max-sm:fixed max-sm:top-0 max-sm:bottom-0 max-sm:right-0 max-sm:z-20 max-sm:bg-[#ffffff99] max-sm:px-8 max-sm:py-20 max-sm:shadow-2xl max-sm:text-right max-sm:w-3/4 max-sm:backdrop-blur-sm max-sm:items-stretch transition-all origin-top items-center gap-1 md:gap-3 lg:gap-5 text-lg md:text-xl' +
            ' ' +
            (isShowMenu ? 'max-sm:scale-y-100' : 'max-sm:scale-y-0')
            // show or hide base on isShowMenu
          }
        >
          {/* close button */}
          <button className="sm:hidden mt-1 text-4xl absolute top-0 right-0 p-4" onClick={() => setIsShowMenu(!isShowMenu)}>
            <IoIosCloseCircleOutline className="text-red-500 rounded-full hover:text-white hover:bg-red-500 transition-all" />
          </button>

          {/* link to index route */}
          <NavLink
            className={({ isActive }) => (isActive ? 'bg-sky-400 text-white' : 'hover:bg-gray-300 hover:text-black') + ' ' + 'max-sm:p-4 p-2 max-sm:rounded-xl rounded-md transition-all'}
            to={'/'}
          >
            Home
          </NavLink>

          {/* link to about section */}
          <NavLink
            className={({ isActive }) => (isActive ? 'bg-sky-400 text-white' : 'hover:bg-gray-300 hover:text-black') + ' ' + 'max-sm:p-4 p-2 max-sm:rounded-xl rounded-md transition-all'}
            to={'about'}
          >
            About
          </NavLink>

          {/* link to work section */}
          <NavLink
            className={({ isActive }) => (isActive ? 'bg-sky-400 text-white' : 'hover:bg-gray-300 hover:text-black') + ' ' + 'max-sm:p-4 p-2 max-sm:rounded-xl rounded-md transition-all'}
            to={'work'}
          >
            Work
          </NavLink>

          {/* link to blog section */}
          <NavLink
            className={({ isActive }) => (isActive ? 'bg-sky-400 text-white' : 'hover:bg-gray-300 hover:text-black') + ' ' + 'max-sm:p-4 p-2 max-sm:rounded-xl rounded-md transition-all'}
            to={'blog'}
          >
            Blog
          </NavLink>

          {/* link to contact section */}
          <NavLink
            className={({ isActive }) => (isActive ? 'bg-sky-400 text-white' : 'hover:bg-gray-300 hover:text-black') + ' ' + 'max-sm:p-4 p-2 max-sm:rounded-xl rounded-md transition-all'}
            to={'contact'}
          >
            Contact
          </NavLink>

          {/* TODO change to login | signup when not log in */}
          {/* TODO change to 12345s | logout when logged in */}
          <div className="flex gap-2 md:gap-4 max-sm:justify-end">
            {/* link to signup section */}
            <NavLink
              className={({ isActive }) => (isActive ? 'bg-sky-400 text-white' : 'hover:bg-gray-300 hover:text-black') + ' ' + 'relative max-sm:p-4 p-2 max-sm:rounded-xl rounded-md transition-all'}
              to={'signup'}
            >
              {/* <IoIosCart className="text-6xl sm:text-2xl md:text-3xl" /> */}
              Signup
              {/* small counter, bring to somewhere else, like count projects or blogs */}
              <span className="absolute text-xl sm:text-xs font-bold top-0 right-0 w-6 h-6 sm:w-4 sm:h-4 flex items-center justify-center rounded-full text-white bg-red-500">{inCart}</span>
            </NavLink>

            <div className="border border-slate-900 w-0"></div>

            {/* link to login section */}
            <NavLink
              className={({ isActive }) => (isActive ? 'bg-sky-400 text-white' : 'hover:bg-gray-300 hover:text-black') + ' ' + 'max-sm:p-4 p-2 max-sm:rounded-xl rounded-md transition-all'}
              to={'login'}
            >
              {/* <IoIosLogIn className="text-6xl sm:text-2xl md:text-3xl" /> */}
              Login
            </NavLink>
          </div>
        </nav>

        <div className="flex-1">
          <button
            type="button"
            className=""
            onClick={() => {
              // change language
              setIsVietnamese(!isVietnamese);
            }}
          >
            {isVietnamese ? 'Vie' : 'Eng'}
          </button>
        </div>
      </header>

      {/* dynamic part */}
      <main className="flex-1 flex flex-col">
        {/* pass functions down without drilling */}
        <Outlet context={{ increase, decrease, reset }} />
      </main>

      {/* only display footer when we are not in home */}
      {pathname !== '/' && <Footer />}
    </>
  );
}
