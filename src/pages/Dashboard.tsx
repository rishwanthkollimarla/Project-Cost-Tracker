import { useEffect } from 'react';
import {
  Box,
  VStack,
  Grid,
  GridItem,
  Heading,
  useToast
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';

import ProjectSummary from '../components/ProjectSummary';
import ItemsList from '../components/ItemsList';
import CostsList from '../components/CostsList';
import { fetchItems } from '../redux/itemsSlice';
import { fetchCosts } from '../redux/costsSlice';
import { RootState } from '../redux/store';

const MotionBox = motion(Box);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const toast = useToast();
  
  useEffect(() => {
    if (user) {
      const loadData = async () => {
        try {
          await Promise.all([
            dispatch(fetchItems()),
            dispatch(fetchCosts())
          ]);
        } catch (error) {
          toast({
            title: 'Error loading data',
            description: 'There was a problem loading your project data. Please refresh the page.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      };
      
      loadData();
    }
  }, [dispatch, user, toast]);
  
  return (
    <Box py={4}>
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Heading size="lg" mb={6}>Project Dashboard</Heading>
        
        <VStack spacing={6} align="stretch">
          {/* Project Summary */}
          <ProjectSummary />
          
          {/* Items and Costs Lists */}
          <Grid 
            templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} 
            gap={6}
          >
            <GridItem>
              <ItemsList />
            </GridItem>
            <GridItem>
              <CostsList />
            </GridItem>
          </Grid>
        </VStack>
      </MotionBox>
    </Box>
  );
};

export default Dashboard;