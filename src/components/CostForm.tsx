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
import { addCost, updateCost } from '../redux/costsSlice';
import { OtherCost } from '../types';

interface CostFormProps {
  isOpen: boolean;
  onClose: () => void;
  currentCost?: OtherCost;
}

const CostForm = ({ isOpen, onClose, currentCost }: CostFormProps) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [errors, setErrors] = useState<{ description?: string; amount?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const dispatch = useDispatch();
  
  // Reset form or set values for editing
  useEffect(() => {
    if (currentCost) {
      setDescription(currentCost.description);
      setAmount(currentCost.amount);
    } else {
      setDescription('');
      setAmount(0);
    }
    setErrors({});
  }, [currentCost, isOpen]);
  
  const validateForm = () => {
    const newErrors: { description?: string; amount?: string } = {};
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      if (currentCost) {
        await dispatch(updateCost({ 
          id: currentCost.id, 
          description, 
          amount 
        }));
      } else {
        await dispatch(addCost({ description, amount }));
      }
      onClose();
    } catch (error) {
      console.error('Error submitting cost:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {currentCost ? 'Edit Cost' : 'Add Additional Cost'}
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.description}>
              <FormLabel>Description</FormLabel>
              <Input
                placeholder="Enter cost description (e.g., Shipping, Tax)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <FormErrorMessage>{errors.description}</FormErrorMessage>
            </FormControl>
            
            <FormControl isInvalid={!!errors.amount}>
              <FormLabel>Amount</FormLabel>
              <NumberInput
                min={0}
                precision={2}
                value={amount}
                onChange={(valueString) => setAmount(parseFloat(valueString))}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormErrorMessage>{errors.amount}</FormErrorMessage>
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
            {currentCost ? 'Update' : 'Add'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CostForm;