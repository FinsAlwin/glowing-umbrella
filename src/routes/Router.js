import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
/****Layouts*****/
const FullLayout = lazy(() => import('../layout/FullLayout'));

/***** Pages ****/

const Starter = lazy(() => import('../views/starter'));
const CreatePetition = lazy(() => import('../views/createPetition'));
const DocxGen = lazy(() => import('../views/docGen'));
const Login = lazy(() => import('../views/login'));

/*****Routes******/

const ThemeRoutes = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', element: <Navigate to="/home" /> },
      { path: '/home', exact: true, element: <Starter /> },
      { path: '/create-petition', exact: true, element: <CreatePetition /> },
      { path: '/:petitionId', exact: true, element: <DocxGen /> },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
];

export default ThemeRoutes;
