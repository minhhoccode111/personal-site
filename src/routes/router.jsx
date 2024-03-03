import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFound from './404';
import Layout, { loader as layoutLoader } from './layout';
import Index from './index';
import Blog, { action as blogAction, loader as blogLoader } from './blog';
// import Post, { action as postAction, loader as postLoader } from './post';
import Work, { action as workAction, loader as workLoader } from './work';
import Contact, { action as contactAction, loader as contactLoader } from './contact';
import Login from './login';
import Signup from './signup';
import About from './about';
import { loader as logoutLoader } from './logout';

export default function Router() {
  // setting router
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      loader: layoutLoader,
      errorElement: <NotFound />,
      children: [
        {
          index: true, // use a default component
          element: <Index />, // component to display at '/'
        },

        {
          path: 'blog',
          children: [
            {
              index: true,
              element: <Blog />,
              errorElement: <NotFound />,
              loader: blogLoader,
              action: blogAction,
            },

            // {
            //   path: 'blog/:postid',
            //   element: <Post />,
            //   errorElement: <NotFound />,
            //   loader: postLoader,
            //   action: postAction,
            // },

            // {
            //   path: 'blog/:postid/view',
            //   element: <PostView/>,
            //   loader: postViewLoader
            // }
          ],
        },

        {
          path: 'work',
          element: <Work />,
          errorElement: <NotFound />,
          loader: workLoader,
          action: workAction,
        },

        {
          path: 'contact',
          element: <Contact />,
          loader: contactLoader,
          action: contactAction,
        },

        {
          path: 'login',
          element: <Login />,
        },

        {
          path: 'signup',
          element: <Signup />,
        },

        {
          path: 'logout',
          loader: logoutLoader,
        },

        {
          path: 'about',
          element: <About />,
        },
      ],
    },
  ]);

  // wrapper with setting router
  return <RouterProvider router={router} />;
}
