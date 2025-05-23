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
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Eye, EyeOff, DollarSign } from 'lucide-react';
import { useDispatch } from 'react-redux';

import { auth } from '../firebase/config';
import { setUser, setLoading, setError } from '../redux/authSlice';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  
  const dispatch = useDispatch();
  const toast = useToast();

  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
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
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    dispatch(setLoading(true));
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name
        });
        
        dispatch(setUser({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: name,
        }));
      }
      
      toast({
        title: 'Account created',
        description: 'Your account has been successfully created',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      let errorMessage = 'An unknown error occurred';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already in use';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
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
          <Heading size="lg">Create Account</Heading>
          <Text color="gray.600" textAlign="center">
            Sign up to start tracking your project costs
          </Text>
        </VStack>
        
        <form onSubmit={handleRegister}>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>Name</FormLabel>
              <Input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>
            
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
                  placeholder="Create a password"
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
            
            <FormControl isInvalid={!!errors.confirmPassword}>
              <FormLabel>Confirm Password</FormLabel>
              <Input 
                type={showPassword ? 'text' : 'password'} 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
              />
              <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
            </FormControl>
            
            <Button 
              type="submit" 
              colorScheme="primary" 
              size="lg" 
              width="full"
              mt={2}
              isLoading={isSubmitting}
            >
              Sign Up
            </Button>
          </VStack>
        </form>
        
        <Text mt={6} textAlign="center">
          Already have an account?{' '}
          <Link as={RouterLink} to="/login" color="primary.500" fontWeight="medium">
            Sign in
          </Link>
        </Text>
      </Box>
    </Box>
  );
};

export default Register;