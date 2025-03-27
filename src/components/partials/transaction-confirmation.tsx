"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { resetTransaction } from "@/lib/features/transaction/transactionSlice";

export default function TransactionConfirmation() {
  const dispatch = useAppDispatch();
  const { currentTransaction } = useAppSelector((state) => state.transactions);

  if (!currentTransaction) {
    return (
      <div className="text-center p-6">
        <div className="rounded-full bg-yellow-50 w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <svg
            className="h-8 w-8 text-yellow-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <p className="text-gray-600 mb-4">No transaction data found.</p>
        <Button
          onClick={() => dispatch(resetTransaction())}
          className="w-full bg-black hover:bg-gray-800 text-white py-5 rounded-lg"
        >
          New Transaction
        </Button>
      </div>
    );
  }

  const handleNewTransaction = () => {
    dispatch(resetTransaction());
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-center">
        <div className="rounded-full bg-green-100 w-16 h-16 flex items-center justify-center mb-2">
          <svg
            className="h-8 w-8 text-green-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
        <p className="text-green-700 font-medium">
          Transfer Successfully Completed
        </p>
      </div>

      <div className="space-y-3 bg-gray-50 p-5 rounded-lg">
        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
          <span className="text-sm text-gray-500">Network:</span>
          <span className="font-medium">{currentTransaction.networkChain}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">From:</span>
          <span className="font-medium">
            {currentTransaction.originTokenName}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">To:</span>
          <span className="font-medium">
            {currentTransaction.destinationTokenName}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Amount:</span>
          <span className="font-medium">
            {currentTransaction.destinationAmount}
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-sm text-gray-500">Destination Address:</span>
          <div className="p-3 bg-gray-100 rounded-lg text-xs font-mono break-all">
            {currentTransaction.destinationAddress}
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-sm text-gray-500">Transaction ID:</span>
          <div className="p-3 bg-gray-100 rounded-lg text-xs font-mono break-all">
            {currentTransaction.id ||
              "0x" + Math.random().toString(16).substring(2, 42)}
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="text-sm text-gray-500">Date:</span>
          <span className="font-medium">
            {new Date(currentTransaction.timestamp).toLocaleString()}
          </span>
        </div>
      </div>

      <Button
        onClick={handleNewTransaction}
        className="w-full bg-black hover:bg-gray-800 text-white py-5 rounded-lg transition-all duration-300 shadow-md"
      >
        New Transaction
      </Button>
    </div>
  );
}
