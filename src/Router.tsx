import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/Home.page';
import { Auth } from './pages/Auth.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/auth',
    element: <Auth />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
