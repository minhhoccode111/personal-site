import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFound from './404';
import Frame, { loader as frameLoader } from './frame';
import Index from './index';
import Blog, { action as blogAction, loader as blogLoader } from './blog';
// import Post, { action as postAction, loader as postLoader } from './post';
import Work, { action as workAction, loader as workLoader } from './work';
import Contact, { action as contactAction, loader as contactLoader } from './contact';
import Login from './login';
import Signup from './signup';
import About from './about';

export default function Router() {
  // setting router
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Frame />,
      loader: frameLoader,
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
          element: <Signup />,
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
