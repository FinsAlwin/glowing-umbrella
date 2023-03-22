import { Outlet, Navigate } from 'react-router-dom';
import Header from './Header';
import { ChakraProvider, theme } from '@chakra-ui/react';

const FullLayout = () => {
  const isLoggedIn = localStorage.getItem('token');
  const userId = localStorage.getItem('userid');
  return (
    <>
      {isLoggedIn && (
        <main>
          <ChakraProvider theme={theme}>
            <Header />
            <Outlet />
          </ChakraProvider>
        </main>
      )}
      {!isLoggedIn && !userId && <Navigate to="/login" />}
    </>
  );
};

export default FullLayout;
