import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import itemsReducer from './itemsSlice';
import costsReducer from './costsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    items: itemsReducer,
    costs: costsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values in state
        ignoredActions: ['auth/setUser', 'items/fetchItems/fulfilled', 'costs/fetchCosts/fulfilled'],
        ignoredPaths: ['items.items', 'costs.costs'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;