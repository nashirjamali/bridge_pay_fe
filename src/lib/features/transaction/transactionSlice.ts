import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum TransactionStep {
  FORM = "form",
  REVIEW = "review",
  CONFIRMATION = "confirmation",
}

export interface Transaction {
  id: string;
  networkChain: string;
  destinationAddress: string;
  destinationAmount: number;
  destinationTokenName: string;
  originTokenName: string;
  timestamp: number;
}

interface TransactionState {
  currentStep: TransactionStep;
  currentTransaction: Transaction | null;
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  currentStep: TransactionStep.FORM,
  currentTransaction: null,
  transactions: [],
  loading: false,
  error: null,
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<TransactionStep>) => {
      state.currentStep = action.payload;
    },
    setTransactionData: (
      state,
      action: PayloadAction<Omit<Transaction, "id" | "timestamp">>
    ) => {
      state.currentTransaction = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
    },
    confirmTransaction: (state) => {
      if (state.currentTransaction) {
        state.transactions.push(state.currentTransaction);
        state.currentStep = TransactionStep.CONFIRMATION;
      }
    },
    resetTransaction: (state) => {
      state.currentTransaction = null;
      state.currentStep = TransactionStep.FORM;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setStep,
  setTransactionData,
  confirmTransaction,
  resetTransaction,
  setLoading,
  setError,
} = transactionSlice.actions;
export default transactionSlice.reducer;
