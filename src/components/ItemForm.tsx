import { useState, useEffect } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  VStack
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { addItem, updateItem } from '../redux/itemsSlice';
import { ProjectItem } from '../types';

interface ItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  currentItem?: ProjectItem;
}

const ItemForm = ({ isOpen, onClose, currentItem }: ItemFormProps) => {
  const [name, setName] = useState('');
  const [cost, setCost] = useState<number>(0);
  const [errors, setErrors] = useState<{ name?: string; cost?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const dispatch = useDispatch();
  
  // Reset form or set values for editing
  useEffect(() => {
    if (currentItem) {
      setName(currentItem.name);
      setCost(currentItem.cost);
    } else {
      setName('');
      setCost(0);
    }
    setErrors({});
  }, [currentItem, isOpen]);
  
  const validateForm = () => {
    const newErrors: { name?: string; cost?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (cost <= 0) {
      newErrors.cost = 'Cost must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      if (currentItem) {
        await dispatch(updateItem({ 
          id: currentItem.id, 
          name, 
          cost 
        }));
      } else {
        await dispatch(addItem({ name, cost }));
      }
      onClose();
    } catch (error) {
      console.error('Error submitting item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {currentItem ? 'Edit Item' : 'Add New Item'}
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>Item Name</FormLabel>
              <Input
                placeholder="Enter item name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>
            
            <FormControl isInvalid={!!errors.cost}>
              <FormLabel>Cost</FormLabel>
              <NumberInput
                min={0}
                precision={2}
                value={cost}
                onChange={(valueString) => setCost(parseFloat(valueString))}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormErrorMessage>{errors.cost}</FormErrorMessage>
            </FormControl>
          </VStack>
        </ModalBody>
        
        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button 
            colorScheme="primary" 
            isLoading={isSubmitting}
            onClick={handleSubmit}
          >
            {currentItem ? 'Update' : 'Add'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ItemForm;