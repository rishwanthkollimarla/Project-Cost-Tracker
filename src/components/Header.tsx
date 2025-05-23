import { 
  Box, 
  Flex, 
  Button, 
  Text, 
  useColorModeValue, 
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { Menu as MenuIcon, X, User, LogOut, DollarSign } from 'lucide-react';

import { auth } from '../firebase/config';
import { clearUser } from '../redux/authSlice';
import { RootState } from '../redux/store';

const Header = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Box 
      bg={bg}
      boxShadow="sm"
      position="sticky" 
      top="0" 
      zIndex="sticky"
      borderBottom="1px"
      borderColor={borderColor}
    >
      <Flex
        h="16"
        alignItems="center"
        justifyContent="space-between"
        maxW="1200px"
        mx="auto"
        px={4}
      >
        {/* Logo/Brand */}
        <Flex alignItems="center">
          <DollarSign size={24} color="#3B82F6" />
          <Text 
            fontWeight="bold" 
            fontSize="lg" 
            ml={2}
            display={{ base: 'none', md: 'block' }}
          >
            Project Cost Tracker
          </Text>
        </Flex>

        {/* Desktop Navigation */}
        <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
          {user && (
            <Flex alignItems="center">
              <Text fontSize="sm" mr={4}>
                {user.email}
              </Text>
              <Menu>
                <MenuButton 
                  as={Button} 
                  size="sm" 
                  rightIcon={<User size={16} />}
                  variant="ghost"
                >
                  Account
                </MenuButton>
                <MenuList>
                  <MenuItem icon={<LogOut size={16} />} onClick={handleLogout}>
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          )}
        </HStack>

        {/* Mobile Menu Button */}
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          aria-label="Open menu"
          fontSize="20px"
          variant="ghost"
          icon={<MenuIcon size={24} />}
          onClick={onOpen}
        />
      </Flex>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            <Flex align="center">
              <DollarSign size={20} color="#3B82F6" />
              <Text ml={2}>Project Cost Tracker</Text>
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="start" mt={4}>
              {user && (
                <>
                  <Text fontSize="sm">{user.email}</Text>
                  <Button 
                    leftIcon={<LogOut size={16} />} 
                    variant="ghost" 
                    justifyContent="flex-start"
                    w="full"
                    onClick={() => {
                      handleLogout();
                      onClose();
                    }}
                  >
                    Logout
                  </Button>
                </>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Header;