import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc,
  query,
  where, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { CostsState, OtherCost } from '../types';
import { RootState } from './store';

const initialState: CostsState = {
  costs: [],
  loading: false,
  error: null,
};

// Fetch costs from Firestore
export const fetchCosts = createAsyncThunk(
  'costs/fetchCosts',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      if (!auth.user) return rejectWithValue('User not authenticated');

      const costsRef = collection(db, 'costs');
      const q = query(costsRef, where('userId', '==', auth.user.uid));
      const querySnapshot = await getDocs(q);
      
      const costs: OtherCost[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        costs.push({
          id: doc.id,
          description: data.description,
          amount: data.amount,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
        });
      });
      
      return costs;
    } catch (error) {
      return rejectWithValue('Failed to fetch costs');
    }
  }
);

// Add a new cost
export const addCost = createAsyncThunk(
  'costs/addCost',
  async ({ description, amount }: { description: string; amount: number }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      if (!auth.user) return rejectWithValue('User not authenticated');

      const costsRef = collection(db, 'costs');
      const newCost = {
        description,
        amount,
        userId: auth.user.uid,
        createdAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(costsRef, newCost);
      
      return {
        id: docRef.id,
        description,
        amount,
        createdAt: new Date(),
      };
    } catch (error) {
      return rejectWithValue('Failed to add cost');
    }
  }
);

// Update an existing cost
export const updateCost = createAsyncThunk(
  'costs/updateCost',
  async ({ id, description, amount }: { id: string; description: string; amount: number }, { rejectWithValue }) => {
    try {
      const costRef = doc(db, 'costs', id);
      await updateDoc(costRef, { description, amount });
      
      return { id, description, amount };
    } catch (error) {
      return rejectWithValue('Failed to update cost');
    }
  }
);

// Delete a cost
export const deleteCost = createAsyncThunk(
  'costs/deleteCost',
  async (id: string, { rejectWithValue }) => {
    try {
      const costRef = doc(db, 'costs', id);
      await deleteDoc(costRef);
      
      return id;
    } catch (error) {
      return rejectWithValue('Failed to delete cost');
    }
  }
);

const costsSlice = createSlice({
  name: 'costs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch costs
      .addCase(fetchCosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCosts.fulfilled, (state, action: PayloadAction<OtherCost[]>) => {
        state.costs = action.payload;
        state.loading = false;
      })
      .addCase(fetchCosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add cost
      .addCase(addCost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCost.fulfilled, (state, action: PayloadAction<OtherCost>) => {
        state.costs.push(action.payload);
        state.loading = false;
      })
      .addCase(addCost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update cost
      .addCase(updateCost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCost.fulfilled, (state, action: PayloadAction<{ id: string; description: string; amount: number }>) => {
        const index = state.costs.findIndex(cost => cost.id === action.payload.id);
        if (index !== -1) {
          state.costs[index] = {
            ...state.costs[index],
            ...action.payload
          };
        }
        state.loading = false;
      })
      .addCase(updateCost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete cost
      .addCase(deleteCost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCost.fulfilled, (state, action: PayloadAction<string>) => {
        state.costs = state.costs.filter(cost => cost.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteCost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default costsSlice.reducer;