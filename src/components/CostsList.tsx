import { useState } from 'react';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  HStack,
  Text,
  useDisclosure,
  Flex,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  Select,
  Skeleton
} from '@chakra-ui/react';
import { Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { deleteCost } from '../redux/costsSlice';
import { OtherCost, SortOption } from '../types';
import CostForm from './CostForm';

const CostsList = () => {
  const { costs, loading, error } = useSelector((state: RootState) => state.costs);
  const dispatch = useDispatch();
  const toast = useToast();
  
  const [currentCost, setCurrentCost] = useState<OtherCost | undefined>(undefined);
  const [sortOption, setSortOption] = useState<SortOption>({ field: 'description', direction: 'asc' });
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const handleEdit = (cost: OtherCost) => {
    setCurrentCost(cost);
    onOpen();
  };
  
  const handleAdd = () => {
    setCurrentCost(undefined);
    onOpen();
  };
  
  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteCost(id));
      toast({
        title: 'Cost deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete cost',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  const handleSort = (field: string) => {
    if (sortOption.field === field) {
      setSortOption({
        ...sortOption,
        direction: sortOption.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      setSortOption({ field, direction: 'asc' });
    }
  };
  
  const getSortedCosts = () => {
    if (!costs.length) return [];
    
    return [...costs].sort((a, b) => {
      if (sortOption.field === 'description') {
        const comparison = a.description.localeCompare(b.description);
        return sortOption.direction === 'asc' ? comparison : -comparison;
      } else if (sortOption.field === 'amount') {
        const comparison = a.amount - b.amount;
        return sortOption.direction === 'asc' ? comparison : -comparison;
      } else if (sortOption.field === 'createdAt') {
        const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
        const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
        const comparison = dateA - dateB;
        return sortOption.direction === 'asc' ? comparison : -comparison;
      }
      return 0;
    });
  };
  
  const sortedCosts = getSortedCosts();
  
  const renderSortIcon = (field: string) => {
    if (sortOption.field !== field) return null;
    return sortOption.direction === 'asc' ? 
      <ChevronUp size={16} /> : 
      <ChevronDown size={16} />;
  };
  
  if (error) {
    return (
      <Alert status="error" borderRadius="md" mb={4}>
        <AlertIcon />
        <AlertTitle>{error}</AlertTitle>
      </Alert>
    );
  }
  
  return (
    <>
      <Box 
        borderWidth="1px" 
        borderRadius="lg" 
        overflow="hidden" 
        bg="white" 
        shadow="sm"
      >
        <Flex 
          p={4} 
          justifyContent="space-between" 
          alignItems="center" 
          borderBottomWidth="1px"
        >
          <Text fontSize="lg" fontWeight="medium">Additional Costs</Text>
          <HStack spacing={2}>
            <Select 
              size="sm" 
              width="auto" 
              value={`${sortOption.field}-${sortOption.direction}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-');
                setSortOption({ field, direction: direction as 'asc' | 'desc' });
              }}
            >
              <option value="description-asc">Description (A-Z)</option>
              <option value="description-desc">Description (Z-A)</option>
              <option value="amount-asc">Amount (Low-High)</option>
              <option value="amount-desc">Amount (High-Low)</option>
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
            </Select>
            <Button 
              size="sm" 
              colorScheme="primary" 
              onClick={handleAdd}
            >
              Add Cost
            </Button>
          </HStack>
        </Flex>
        
        {loading ? (
          <Box p={4}>
            {[1, 2, 3].map(i => (
              <Skeleton key={i} height="40px" my={2} />
            ))}
          </Box>
        ) : (
          <>
            {sortedCosts.length === 0 ? (
              <Box p={6} textAlign="center">
                <Text color="gray.500">No additional costs added yet</Text>
                <Button 
                  mt={4} 
                  size="sm" 
                  colorScheme="primary" 
                  onClick={handleAdd}
                >
                  Add Your First Cost
                </Button>
              </Box>
            ) : (
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th 
                        cursor="pointer" 
                        onClick={() => handleSort('description')}
                      >
                        <Flex alignItems="center">
                          Description {renderSortIcon('description')}
                        </Flex>
                      </Th>
                      <Th 
                        cursor="pointer" 
                        onClick={() => handleSort('amount')}
                        isNumeric
                      >
                        <Flex alignItems="center" justifyContent="flex-end">
                          Amount {renderSortIcon('amount')}
                        </Flex>
                      </Th>
                      <Th width="100px">Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {sortedCosts.map((cost) => (
                      <Tr key={cost.id} _hover={{ bg: 'gray.50' }}>
                        <Td>{cost.description}</Td>
                        <Td isNumeric>
                          ${cost.amount.toFixed(2)}
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <IconButton
                              aria-label="Edit cost"
                              icon={<Edit2 size={16} />}
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(cost)}
                            />
                            <IconButton
                              aria-label="Delete cost"
                              icon={<Trash2 size={16} />}
                              size="sm"
                              variant="ghost"
                              colorScheme="red"
                              onClick={() => handleDelete(cost.id)}
                            />
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            )}
          </>
        )}
      </Box>
      
      <CostForm 
        isOpen={isOpen} 
        onClose={onClose}
        currentCost={currentCost}
      />
    </>
  );
};

export default CostsList;