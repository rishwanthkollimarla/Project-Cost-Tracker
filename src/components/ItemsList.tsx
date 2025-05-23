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
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  Select,
  Skeleton
} from '@chakra-ui/react';
import { Edit2, Trash2, MoreVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { deleteItem } from '../redux/itemsSlice';
import { ProjectItem, SortOption } from '../types';
import ItemForm from './ItemForm';

const ItemsList = () => {
  const { items, loading, error } = useSelector((state: RootState) => state.items);
  const dispatch = useDispatch();
  const toast = useToast();
  
  const [currentItem, setCurrentItem] = useState<ProjectItem | undefined>(undefined);
  const [sortOption, setSortOption] = useState<SortOption>({ field: 'name', direction: 'asc' });
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const handleEdit = (item: ProjectItem) => {
    setCurrentItem(item);
    onOpen();
  };
  
  const handleAdd = () => {
    setCurrentItem(undefined);
    onOpen();
  };
  
  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteItem(id));
      toast({
        title: 'Item deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete item',
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
  
  const getSortedItems = () => {
    if (!items.length) return [];
    
    return [...items].sort((a, b) => {
      if (sortOption.field === 'name') {
        const comparison = a.name.localeCompare(b.name);
        return sortOption.direction === 'asc' ? comparison : -comparison;
      } else if (sortOption.field === 'cost') {
        const comparison = a.cost - b.cost;
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
  
  const sortedItems = getSortedItems();
  
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
          <Text fontSize="lg" fontWeight="medium">Project Items</Text>
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
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="cost-asc">Cost (Low-High)</option>
              <option value="cost-desc">Cost (High-Low)</option>
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
            </Select>
            <Button 
              size="sm" 
              colorScheme="primary" 
              onClick={handleAdd}
            >
              Add Item
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
            {sortedItems.length === 0 ? (
              <Box p={6} textAlign="center">
                <Text color="gray.500">No items added yet</Text>
                <Button 
                  mt={4} 
                  size="sm" 
                  colorScheme="primary" 
                  onClick={handleAdd}
                >
                  Add Your First Item
                </Button>
              </Box>
            ) : (
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th 
                        cursor="pointer" 
                        onClick={() => handleSort('name')}
                      >
                        <Flex alignItems="center">
                          Item Name {renderSortIcon('name')}
                        </Flex>
                      </Th>
                      <Th 
                        cursor="pointer" 
                        onClick={() => handleSort('cost')}
                        isNumeric
                      >
                        <Flex alignItems="center" justifyContent="flex-end">
                          Cost {renderSortIcon('cost')}
                        </Flex>
                      </Th>
                      <Th width="100px">Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {sortedItems.map((item) => (
                      <Tr key={item.id} _hover={{ bg: 'gray.50' }}>
                        <Td>{item.name}</Td>
                        <Td isNumeric>
                          ${item.cost.toFixed(2)}
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <IconButton
                              aria-label="Edit item"
                              icon={<Edit2 size={16} />}
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(item)}
                            />
                            <IconButton
                              aria-label="Delete item"
                              icon={<Trash2 size={16} />}
                              size="sm"
                              variant="ghost"
                              colorScheme="red"
                              onClick={() => handleDelete(item.id)}
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
      
      <ItemForm 
        isOpen={isOpen} 
        onClose={onClose} 
        currentItem={currentItem} 
      />
    </>
  );
};

export default ItemsList;