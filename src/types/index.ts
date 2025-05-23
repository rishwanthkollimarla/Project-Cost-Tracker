export interface ProjectItem {
  id: string;
  name: string;
  cost: number;
  createdAt: Date | number;
}

export interface OtherCost {
  id: string;
  description: string;
  amount: number;
  createdAt: Date | number;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface ItemsState {
  items: ProjectItem[];
  loading: boolean;
  error: string | null;
}

export interface CostsState {
  costs: OtherCost[];
  loading: boolean;
  error: string | null;
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}