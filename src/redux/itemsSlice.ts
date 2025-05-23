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
import { ItemsState, ProjectItem } from '../types';
import { RootState } from './store';

const initialState: ItemsState = {
  items: [],
  loading: false,
  error: null,
};

// Fetch items from Firestore
export const fetchItems = createAsyncThunk(
  'items/fetchItems',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      if (!auth.user) return rejectWithValue('User not authenticated');

      const itemsRef = collection(db, 'items');
      const q = query(itemsRef, where('userId', '==', auth.user.uid));
      const querySnapshot = await getDocs(q);
      
      const items: ProjectItem[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          name: data.name,
          cost: data.cost,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
        });
      });
      
      return items;
    } catch (error) {
      return rejectWithValue('Failed to fetch items');
    }
  }
);

// Add a new item
export const addItem = createAsyncThunk(
  'items/addItem',
  async ({ name, cost }: { name: string; cost: number }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      if (!auth.user) return rejectWithValue('User not authenticated');

      const itemsRef = collection(db, 'items');
      const newItem = {
        name,
        cost,
        userId: auth.user.uid,
        createdAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(itemsRef, newItem);
      
      return {
        id: docRef.id,
        name,
        cost,
        createdAt: new Date(),
      };
    } catch (error) {
      return rejectWithValue('Failed to add item');
    }
  }
);

// Update an existing item
export const updateItem = createAsyncThunk(
  'items/updateItem',
  async ({ id, name, cost }: { id: string; name: string; cost: number }, { rejectWithValue }) => {
    try {
      const itemRef = doc(db, 'items', id);
      await updateDoc(itemRef, { name, cost });
      
      return { id, name, cost };
    } catch (error) {
      return rejectWithValue('Failed to update item');
    }
  }
);

// Delete an item
export const deleteItem = createAsyncThunk(
  'items/deleteItem',
  async (id: string, { rejectWithValue }) => {
    try {
      const itemRef = doc(db, 'items', id);
      await deleteDoc(itemRef);
      
      return id;
    } catch (error) {
      return rejectWithValue('Failed to delete item');
    }
  }
);

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch items
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action: PayloadAction<ProjectItem[]>) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add item
      .addCase(addItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItem.fulfilled, (state, action: PayloadAction<ProjectItem>) => {
        state.items.push(action.payload);
        state.loading = false;
      })
      .addCase(addItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update item
      .addCase(updateItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateItem.fulfilled, (state, action: PayloadAction<{ id: string; name: string; cost: number }>) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = {
            ...state.items[index],
            ...action.payload
          };
        }
        state.loading = false;
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete item
      .addCase(deleteItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteItem.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default itemsSlice.reducer;