"use client";

import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { Category, DataState, Expense, Project, Vendor } from "@/lib/types";
import { clearData, generateId, loadData, saveData } from "@/lib/storage";

type Action =
  | { type: "addProject"; project: Omit<Project, "id"> }
  | { type: "updateProject"; project: Project }
  | { type: "deleteProject"; id: string }
  | { type: "addCategory"; category: Omit<Category, "id"> }
  | { type: "updateCategory"; category: Category }
  | { type: "deleteCategory"; id: string }
  | { type: "addVendor"; vendor: Omit<Vendor, "id"> }
  | { type: "updateVendor"; vendor: Vendor }
  | { type: "deleteVendor"; id: string }
  | { type: "addExpense"; expense: Omit<Expense, "id"> }
  | { type: "updateExpense"; expense: Expense }
  | { type: "deleteExpense"; id: string }
  | { type: "replaceAll"; data: DataState }
  | { type: "resetDemo" };

function reducer(state: DataState, action: Action): DataState {
  switch (action.type) {
    case "addProject":
      return { ...state, projects: [...state.projects, { ...action.project, id: generateId() }] };
    case "updateProject":
      return { ...state, projects: state.projects.map((p) => (p.id === action.project.id ? action.project : p)) };
    case "deleteProject": {
      const projects = state.projects.filter((p) => p.id !== action.id);
      const expenses = state.expenses.filter((e) => e.projectId !== action.id);
      return { ...state, projects, expenses };
    }

    case "addCategory":
      return { ...state, categories: [...state.categories, { ...action.category, id: generateId() }] };
    case "updateCategory":
      return { ...state, categories: state.categories.map((c) => (c.id === action.category.id ? action.category : c)) };
    case "deleteCategory": {
      const categories = state.categories.filter((c) => c.id !== action.id);
      const expenses = state.expenses.filter((e) => e.categoryId !== action.id);
      return { ...state, categories, expenses };
    }

    case "addVendor":
      return { ...state, vendors: [...state.vendors, { ...action.vendor, id: generateId() }] };
    case "updateVendor":
      return { ...state, vendors: state.vendors.map((v) => (v.id === action.vendor.id ? action.vendor : v)) };
    case "deleteVendor": {
      const vendors = state.vendors.filter((v) => v.id !== action.id);
      const expenses = state.expenses.map((e) => (e.vendorId === action.id ? { ...e, vendorId: undefined } : e));
      return { ...state, vendors, expenses };
    }

    case "addExpense":
      return { ...state, expenses: [...state.expenses, { ...action.expense, id: generateId() }] };
    case "updateExpense":
      return { ...state, expenses: state.expenses.map((e) => (e.id === action.expense.id ? action.expense : e)) };
    case "deleteExpense":
      return { ...state, expenses: state.expenses.filter((e) => e.id !== action.id) };

    case "replaceAll":
      return action.data;

    case "resetDemo": {
      const demo = createDemoData();
      return demo;
    }

    default:
      return state;
  }
}

function createDemoData(): DataState {
  const p1 = { id: generateId(), name: "Office Renovation", code: "PRJ-001", budget: 50000, active: true };
  const p2 = { id: generateId(), name: "Warehouse Build", code: "PRJ-002", budget: 200000, active: true };

  const c1 = { id: generateId(), name: "Materials" };
  const c2 = { id: generateId(), name: "Labor" };
  const c3 = { id: generateId(), name: "Equipment" };

  const v1 = { id: generateId(), name: "ABC Supplies" };
  const v2 = { id: generateId(), name: "Prime Contractors" };

  const e1: Expense = {
    id: generateId(),
    date: new Date().toISOString().slice(0, 10),
    projectId: p1.id,
    categoryId: c1.id,
    vendorId: v1.id,
    description: "Drywall sheets",
    amount: 1200,
    tax: 96,
    invoiceNumber: "INV-1001",
    paid: true,
    paymentMethod: "Card",
  };

  const e2: Expense = {
    id: generateId(),
    date: new Date().toISOString().slice(0, 10),
    projectId: p2.id,
    categoryId: c2.id,
    vendorId: v2.id,
    description: "Masonry labor, week 1",
    amount: 3500,
    tax: 0,
    invoiceNumber: "INV-1002",
    paid: false,
    paymentMethod: "Wire",
  };

  return {
    projects: [p1, p2],
    categories: [c1, c2, c3],
    vendors: [v1, v2],
    expenses: [e1, e2],
  };
}

interface AppStateContextValue {
  state: DataState;
  dispatch: React.Dispatch<Action>;
}

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined as unknown as DataState, () => {
    const loaded = loadData();
    if (
      loaded.projects.length === 0 &&
      loaded.categories.length === 0 &&
      loaded.vendors.length === 0 &&
      loaded.expenses.length === 0
    ) {
      return createDemoData();
    }
    return loaded;
  });

  useEffect(() => {
    saveData(state);
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateContextValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}

export function useHelpers() {
  const { state, dispatch } = useAppState();
  return {
    state,
    addProject: (project: Omit<Project, "id">) => dispatch({ type: "addProject", project }),
    updateProject: (project: Project) => dispatch({ type: "updateProject", project }),
    deleteProject: (id: string) => dispatch({ type: "deleteProject", id }),

    addCategory: (category: Omit<Category, "id">) => dispatch({ type: "addCategory", category }),
    updateCategory: (category: Category) => dispatch({ type: "updateCategory", category }),
    deleteCategory: (id: string) => dispatch({ type: "deleteCategory", id }),

    addVendor: (vendor: Omit<Vendor, "id">) => dispatch({ type: "addVendor", vendor }),
    updateVendor: (vendor: Vendor) => dispatch({ type: "updateVendor", vendor }),
    deleteVendor: (id: string) => dispatch({ type: "deleteVendor", id }),

    addExpense: (expense: Omit<Expense, "id">) => dispatch({ type: "addExpense", expense }),
    updateExpense: (expense: Expense) => dispatch({ type: "updateExpense", expense }),
    deleteExpense: (id: string) => dispatch({ type: "deleteExpense", id }),

    importAll: (data: DataState) => dispatch({ type: "replaceAll", data }),
    resetDemo: () => dispatch({ type: "resetDemo" }),
    clearAll: () => clearData(),
  };
}
