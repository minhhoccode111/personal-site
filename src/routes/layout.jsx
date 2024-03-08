import { IoIosCloseCircleOutline, IoIosMenu, IoIosCreate, IoIosLogIn, IoIosLogOut } from 'react-icons/io';
import { FaRegLightbulb, FaLightbulb } from 'react-icons/fa';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from './../components/footer';
import { get, set } from './../methods/index';

export default function Layout() {
  // location.pathname - the path of the current URL
  const { pathname } = useLocation();

  // language
  const [isLightTheme, setIsLightTheme] = useState(true);

  // hamburger menu state
  const [isShowMenu, setIsShowMenu] = useState(false);

  // blog posts to use through out this session
  const [blogPosts, setBlogPosts] = useState([]);
  // console.log(blogPosts);

  // counter
  const [countBlogs, setCountBlogs] = useState(0);
  // TODO implement an API to CRUD projects
  // const [countProjects, setCountProjects] = useState(0);

  // state of blog posts fetching
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isErrorPosts, setIsErrorPosts] = useState(false);

  // login state on local storage
  const [loginState, setLoginState] = useState({});

  // init user data on local storage if has
  useEffect(() => {
    const state = get();

    // only use when token not expired
    if (new Date(state.expiresInDate) > new Date()) setLoginState(() => state);
    // else clear local store, keep the default loginState above {}
    else set({});
  }, []);

  // a flag to fetch blog again to keep things sync
  const [willFetchPosts, setWillFetchPosts] = useState(false);

  // start fetching blogs here when the page first load or when user's authentication change
  useEffect(() => {
    async function tmp() {
      setIsLoadingPosts(() => true);

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

        setIsErrorPosts(() => true);
      } finally {
        setIsLoadingPosts(() => false);

        // console.log(`blog fetched!`);
      }
    }
    tmp();
    // only fetch again if user log in or out
  }, [loginState, willFetchPosts]);

  return (
    <>
      <header
        id="header"
        className={'flex gap-3 sm:gap-5 md:gap-7 lg:gap-9 items-center p-4 sm:p-5 md:p-6 lg:p-7 shadow-lg shadow-gray-300 text-slate-700 bg-white' + ' ' + (pathname !== '/' && 'bg-slate-50')}
        // color base on url path
      >
        {/* hamburger button */}
        <nav className={'sm:hidden'}>
          {/* click to toggle menu */}
          <button className="hover:bg-gray-300 hover:text-black p-2 max-sm:rounded-xl rounded-md transition-all text-4xl" onClick={() => setIsShowMenu(!isShowMenu)}>
            <IoIosMenu />
          </button>
        </nav>

        {/* all nav links */}
        <nav
          className={
            'flex max-sm:flex-col max-sm:gap-8 max-sm:text-4xl max-sm:fixed max-sm:top-0 max-sm:bottom-0 max-sm:right-0 max-sm:z-30 max-sm:bg-[#ffffff99] max-sm:px-8 max-sm:py-20 max-sm:shadow-2xl max-sm:text-right max-sm:w-3/4 max-sm:backdrop-blur-sm max-sm:items-stretch transition-all origin-top items-center gap-1 md:gap-3 lg:gap-5 text-lg md:text-xl' +
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
            <span className="absolute text-xl sm:text-xs font-bold top-0 right-0 w-6 h-6 sm:w-4 sm:h-4 flex items-center justify-center rounded-full text-white bg-red-500">
              {/* {countProjects} TODO*/}0
            </span>
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
              {/* display authentication */}
              <p className={'max-sm:rounded-xl rounded-lg transition-all self-center relative border ' + (loginState?.user?.isCreator ? 'text-danger border-danger' : 'text-success border-success')}>
                {/* a button to toggle username */}
                <button className="peer flex items-stretch justify-stretch max-sm:p-4 p-2">{loginState?.user?.isCreator ? 'Creator' : 'Viewer'}</button>

                {/* a tooltip to display user name */}
                <span className="absolute transition-all px-6 py-3 rounded-md hidden peer-focus:block peer-hover:block max-sm:bottom-full sm:top-full my-4 bg-gray-800 left-1/2 -translate-x-1/2 text-center">
                  {loginState?.user?.fullname}
                </span>
              </p>

              <div className="border border-slate-900 w-0"></div>

              {/* link to logout section */}
              <NavLink
                className={({ isActive }) =>
                  (isActive ? 'bg-sky-400 text-white' : 'hover:bg-gray-300 hover:text-black') + ' ' + 'max-sm:p-4 p-2 max-sm:rounded-xl rounded-md transition-all grid place-items-center'
                }
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
                className={({ isActive }) =>
                  (isActive ? 'bg-sky-400 text-white' : 'hover:bg-gray-300 hover:text-black') + ' ' + 'max-sm:p-4 p-2 max-sm:rounded-xl rounded-md transition-all grid place-items-center'
                }
                to={'signup'}
                title="Signup"
              >
                <IoIosCreate className="text-6xl sm:text-2xl md:text-3xl" />
              </NavLink>

              <div className="border border-slate-900 w-0"></div>

              {/* link to login section */}
              <NavLink
                className={({ isActive }) =>
                  (isActive ? 'bg-sky-400 text-white' : 'hover:bg-gray-300 hover:text-black') + ' ' + 'max-sm:p-4 p-2 max-sm:rounded-xl rounded-md transition-all grid place-items-center'
                }
                to={'login'}
                title="Login"
              >
                <IoIosLogIn className="text-6xl sm:text-2xl md:text-3xl" />
              </NavLink>
            </div>
          )}
        </nav>

        {/* change theme button */}
        <div className="flex-1">
          <button
            type="button"
            className="hover:bg-gray-300 hover:text-black max-sm:p-4 p-2 max-sm:rounded-xl rounded-md transition-all text-xl"
            onClick={() => {
              setIsLightTheme(!isLightTheme);
            }}
          >
            {isLightTheme ? <FaLightbulb /> : <FaRegLightbulb />}
          </button>
        </div>
      </header>

      {/* dynamic part */}
      <main className="flex-1 flex flex-col">
        {/* pass functions down without drilling */}
        <Outlet
          context={{
            blogPosts,
            loginState,
            setBlogPosts,
            isErrorPosts,
            setLoginState,
            isLoadingPosts,
            setIsErrorPosts,
            setWillFetchPosts,
            setIsLoadingPosts,
          }}
        />
      </main>

      {/* only display footer when we are not in home */}
      {pathname !== '/' && <Footer />}
    </>
  );
}
