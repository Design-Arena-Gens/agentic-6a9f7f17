export type Id = string;

export interface Project {
  id: Id;
  name: string;
  code?: string;
  budget?: number;
  active: boolean;
}

export interface Category {
  id: Id;
  name: string;
}

export interface Vendor {
  id: Id;
  name: string;
  contact?: string;
}

export interface Expense {
  id: Id;
  date: string; // ISO date string
  projectId: Id;
  categoryId: Id;
  vendorId?: Id;
  description: string;
  amount: number;
  tax?: number;
  invoiceNumber?: string;
  paid: boolean;
  paymentMethod?: string;
}

export interface DataState {
  projects: Project[];
  categories: Category[];
  vendors: Vendor[];
  expenses: Expense[];
}

export const EMPTY_STATE: DataState = {
  projects: [],
  categories: [],
  vendors: [],
  expenses: [],
};
