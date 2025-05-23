import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Header from './Header';

const Layout = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <Flex direction="column" minH="100vh">
      <Header />
      <Box flex="1" p={4} maxW="1200px" width="100%" mx="auto">
        <Outlet />
      </Box>
    </Flex>
  );
};

export default Layout;