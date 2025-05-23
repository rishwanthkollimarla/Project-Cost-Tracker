import { useState } from 'react';
import { 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  VStack, 
  Heading, 
  Text, 
  Link, 
  InputGroup, 
  InputRightElement, 
  IconButton,
  useToast,
  FormErrorMessage
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Eye, EyeOff, DollarSign } from 'lucide-react';
import { useDispatch } from 'react-redux';

import { auth } from '../firebase/config';
import { setUser, setLoading, setError } from '../redux/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  
  const dispatch = useDispatch();
  const toast = useToast();

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    dispatch(setLoading(true));
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      dispatch(setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
      }));
      
      toast({
        title: 'Success',
        description: 'You have successfully logged in',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      let errorMessage = 'An unknown error occurred';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch(setError(errorMessage));
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <Box 
      minH="100vh" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
      bg="gray.50"
      p={4}
    >
      <Box 
        w={{ base: "90%", md: "400px" }} 
        bg="white" 
        p={8} 
        borderRadius="lg" 
        boxShadow="md"
      >
        <VStack spacing={6} align="center" mb={8}>
          <Box p={2} bg="primary.50" borderRadius="full">
            <DollarSign size={32} color="#3B82F6" />
          </Box>
          <Heading size="lg">Welcome Back</Heading>
          <Text color="gray.600" textAlign="center">
            Sign in to your account to continue
          </Text>
        </VStack>
        
        <form onSubmit={handleLogin}>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>
            
            <FormControl isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    icon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                    size="sm"
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>
            
            <Button 
              type="submit" 
              colorScheme="primary" 
              size="lg" 
              width="full"
              mt={2}
              isLoading={isSubmitting}
            >
              Sign In
            </Button>
          </VStack>
        </form>
        
        <Text mt={6} textAlign="center">
          Don't have an account?{' '}
          <Link as={RouterLink} to="/register" color="primary.500" fontWeight="medium">
            Sign up
          </Link>
        </Text>
      </Box>
    </Box>
  );
};

export default Login;