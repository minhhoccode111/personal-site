import { IoIosCloseCircleOutline, IoIosLogIn, IoIosLogOut } from 'react-icons/io';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from './../components/footer';
import { get, set } from './../methods/index';

export default function Layout() {
  // location.pathname - the path of the current URL
  const { pathname } = useLocation();

  // language
  const [isVietnamese, setIsVietnamese] = useState(true);

  // hamburger menu state
  const [isShowMenu, setIsShowMenu] = useState(false);

  // blog posts to use through out this session
  const [blogPosts, setBlogPosts] = useState([]);

  // counter
  const [countBlogs, setCountBlogs] = useState(0);
  const [countProjects, setCountProjects] = useState(0);

  // state of blog posts fetching
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // error messages to display while fetching blog posts
  const [displayMessages, setDisplayMessages] = useState([]);

  // login state on local storage
  const [loginState, setLoginState] = useState({});

  // init user data on local storage if has
  useEffect(() => {
    const state = get();

    // only use when token not expired
    if (new Date(state.expiresInDate) > new Date()) setLoginState(() => state);
    // else use clear local store, keep the default loginState above {}
    else set({});
  }, []);

  // TODO start fetching blogs here when the page first load
  useEffect(() => {
    async function tmp() {
      try {
        const res = await axios({
          mode: 'cors',
          method: 'get',
          url: import.meta.env.VITE_API_ORIGIN + '/posts',
          headers: {
            Authorization: `Bearer ${loginState?.token}`,
          },
        });

        // set available blogs
        setBlogPosts(() => res?.data?.posts);

        // set count blogs
        setCountBlogs(() => res?.data?.posts?.length);

        // console.log(res.data);
      } catch (err) {
        console.log(err.response);
        if (err.response.status === 400) {
          setDisplayMessages(() => [{ msg: `*Username or password do not match` }]);
        } else {
          setIsError(() => true);

          setDisplayMessages(() => [{ msg: `*There is a server error or  internet connection!` }]);
        }
      } finally {
        setIsLoading(() => false);
      }
    }
    tmp();
    // only fetch again if user log in or out
  }, [loginState]);

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
          <button className="hover:bg-gray-300 hover:text-black max-sm:p-4 p-2 max-sm:rounded-xl rounded-md transition-all" onClick={() => setIsShowMenu(!isShowMenu)}>
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
            className={({ isActive }) => (isActive ? 'bg-sky-400 text-white' : 'hover:bg-gray-300 hover:text-black') + ' ' + 'relative max-sm:p-4 p-2 max-sm:rounded-xl rounded-md transition-all'}
            to={'work'}
          >
            Work
            <span className="absolute text-xl sm:text-xs font-bold top-0 right-0 w-6 h-6 sm:w-4 sm:h-4 flex items-center justify-center rounded-full text-white bg-red-500">{countProjects}</span>
          </NavLink>

          {/* link to blog section */}
          <NavLink
            className={({ isActive }) => (isActive ? 'bg-sky-400 text-white' : 'hover:bg-gray-300 hover:text-black') + ' ' + 'relative max-sm:p-4 p-2 max-sm:rounded-xl rounded-md transition-all'}
            to={'blog'}
          >
            Blog
            <span className="absolute text-xl sm:text-xs font-bold top-0 right-0 w-6 h-6 sm:w-4 sm:h-4 flex items-center justify-center rounded-full text-white bg-red-500">{countBlogs}</span>
          </NavLink>

          {/* link to contact section */}
          <NavLink
            className={({ isActive }) => (isActive ? 'bg-sky-400 text-white' : 'hover:bg-gray-300 hover:text-black') + ' ' + 'max-sm:p-4 p-2 max-sm:rounded-xl rounded-md transition-all'}
            to={'contact'}
          >
            Contact
          </NavLink>

          {/* token not expired */}
          {new Date(loginState?.expiresInDate) > new Date() ? (
            <div className="flex gap-2 md:gap-4 max-sm:justify-end">
              {/* link to signup section */}

              <p className="max-sm:p-4 p-2 max-sm:rounded-xl rounded-md transition-all text-success self-center">{loginState.user.isCreator ? 'Creator' : 'Viewer'}</p>

              <div className="border border-slate-900 w-0"></div>

              {/* link to login section */}
              <NavLink
                className={({ isActive }) => (isActive ? 'bg-sky-400 text-white' : 'hover:bg-gray-300 hover:text-black') + ' ' + 'max-sm:p-4 p-2 max-sm:rounded-xl rounded-md transition-all'}
                to={'logout'}
                title="Logout"
              >
                <IoIosLogOut className="text-6xl sm:text-2xl md:text-3xl" />
              </NavLink>
            </div>
          ) : (
            <div className="flex gap-2 md:gap-4 max-sm:justify-end">
              {/* link to signup section */}
              <NavLink
                className={({ isActive }) => (isActive ? 'bg-sky-400 text-white' : 'hover:bg-gray-300 hover:text-black') + ' ' + 'max-sm:p-4 p-2 max-sm:rounded-xl rounded-md transition-all'}
                to={'signup'}
                title="Signup"
              >
                Signup
              </NavLink>

              <div className="border border-slate-900 w-0"></div>

              {/* link to login section */}
              <NavLink
                className={({ isActive }) => (isActive ? 'bg-sky-400 text-white' : 'hover:bg-gray-300 hover:text-black') + ' ' + 'max-sm:p-4 p-2 max-sm:rounded-xl rounded-md transition-all'}
                to={'login'}
                title="Login"
              >
                <IoIosLogIn className="text-6xl sm:text-2xl md:text-3xl" />
              </NavLink>
            </div>
          )}
        </nav>

        <div className="flex-1">
          <button
            type="button"
            className="hover:bg-gray-300 hover:text-black max-sm:p-4 p-2 max-sm:rounded-xl rounded-md transition-all"
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
        <Outlet
          context={{
            loginState,
            setLoginState,
            blogPosts,
            setBlogPosts,
          }}
        />
      </main>

      {/* only display footer when we are not in home */}
      {pathname !== '/' && <Footer />}
    </>
  );
}
