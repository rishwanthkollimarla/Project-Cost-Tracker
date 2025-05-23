import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  Flex,
  Skeleton
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const ProjectSummary = () => {
  const { items, loading: itemsLoading } = useSelector((state: RootState) => state.items);
  const { costs, loading: costsLoading } = useSelector((state: RootState) => state.costs);
  
  const [itemsTotal, setItemsTotal] = useState(0);
  const [costsTotal, setCostsTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  
  useEffect(() => {
    // Calculate total for items
    const itemSum = items.reduce((sum, item) => sum + item.cost, 0);
    setItemsTotal(itemSum);
    
    // Calculate total for additional costs
    const costSum = costs.reduce((sum, cost) => sum + cost.amount, 0);
    setCostsTotal(costSum);
    
    // Grand total
    setGrandTotal(itemSum + costSum);
  }, [items, costs]);
  
  const loading = itemsLoading || costsLoading;
  
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      mb={6}
      p={6}
      bg="white"
      borderRadius="lg"
      boxShadow="md"
      borderTop="4px solid"
      borderTopColor="primary.500"
    >
      <Text fontSize="xl" fontWeight="bold" mb={4}>Project Summary</Text>
      
      <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }} gap={6}>
        <GridItem>
          <Stat>
            <StatLabel color="gray.600">Items Total</StatLabel>
            {loading ? (
              <Skeleton height="30px" width="120px" mt={2} />
            ) : (
              <StatNumber fontSize="2xl" color="primary.600">${itemsTotal.toFixed(2)}</StatNumber>
            )}
            <StatHelpText>{items.length} item{items.length !== 1 ? 's' : ''}</StatHelpText>
          </Stat>
        </GridItem>
        
        <GridItem>
          <Stat>
            <StatLabel color="gray.600">Additional Costs</StatLabel>
            {loading ? (
              <Skeleton height="30px" width="120px" mt={2} />
            ) : (
              <StatNumber fontSize="2xl" color="accent.600">${costsTotal.toFixed(2)}</StatNumber>
            )}
            <StatHelpText>{costs.length} cost{costs.length !== 1 ? 's' : ''}</StatHelpText>
          </Stat>
        </GridItem>
        
        <GridItem>
          <Box 
            p={3} 
            borderRadius="md" 
            bg="gray.50" 
            borderWidth="1px"
            borderColor="gray.200"
          >
            <Text fontWeight="medium" color="gray.600">Total Project Cost</Text>
            {loading ? (
              <Skeleton height="36px" width="140px" mt={2} />
            ) : (
              <Flex alignItems="center" mt={2}>
                <Text fontSize="3xl" fontWeight="bold" color="green.600">
                  ${grandTotal.toFixed(2)}
                </Text>
              </Flex>
            )}
          </Box>
        </GridItem>
      </Grid>
      
      <Divider my={4} />
      
      <Flex justifyContent="space-between" fontSize="sm" color="gray.600">
        <Text>Last updated: {new Date().toLocaleDateString()}</Text>
        <Text>{items.length + costs.length} total entries</Text>
      </Flex>
    </MotionBox>
  );
};

export default ProjectSummary;