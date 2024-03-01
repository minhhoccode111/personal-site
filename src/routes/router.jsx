import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFound from './404';
import Frame from './frame';
import Index from './index';

export default function Router() {
  // setting router
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Frame />,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: <Index />, // component to display at '/'
        },
      ],
    },
  ]);

  // wrapper with setting router
  return <RouterProvider router={router} />;
}
