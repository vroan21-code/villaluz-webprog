import { createBrowserRouter, RouterProvider } from 'react-router-dom'

//HomePage Structure
import Layout from './layouts/Layout';
import HomePage from './pages/LandingPages/HomePage';
import ArticleListPage from './pages/LandingPages/ArticleListPage';
import ArticlePage from './pages/LandingPages/ArticlePage';
import AboutPage from './pages/LandingPages/AboutPage';

import DashboardPage from './pages/DashboardPages/DashboardPage';
import ReportsPage from './pages/DashboardPages/ReportsPage';
import UsersPage from './pages/DashboardPages/UsersPage';
import ArticlesPage from './pages/DashboardPages/ArticlesPage';
import DashLayout from './layouts/DashLayout';


import AuthLayout from './layouts/AuthLayout';
import SignInPage from './pages/AuthPages/SignInPage';
import SignUpPage from './pages/AuthPages/SignUpPage';

import NotFoundPage from './pages/NotFoundPage';
import RequireAuth from './components/RequireAuth';

const routes = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '',
        element: <HomePage />
      },
      {
        path: 'about',
        element: <AboutPage />
      },
      {
        path: 'articles',
        element: <ArticleListPage />
      },
      {
        path: 'articles/:name',
        element: <ArticlePage />
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <SignInPage />
      },
      {
        path: "signin",
        element: <SignInPage />
      },
      {
        path: "signup",
        element: <SignUpPage />
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <RequireAuth>
        <DashLayout />
      </RequireAuth>
    ),
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "",
        element: <DashboardPage />,
      },
      {
        path: "reports",
        element: <ReportsPage />,
      },
      {
        path: "users",
        element: (
          <RequireAuth adminOnly>
            <UsersPage />
          </RequireAuth>
        ),
      },
      {
        path: "articles",
        element: <ArticlesPage />
      }
    ],
  },
];

const router = createBrowserRouter(routes);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;