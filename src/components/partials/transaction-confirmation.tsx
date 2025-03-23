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
      <div className="text-center p-4">
        <p>No transaction data found.</p>
        <Button
          onClick={() => dispatch(resetTransaction())}
          className="w-full mt-4"
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
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold">Transaction Successful!</h2>
      </div>

      <div className="p-4 bg-green-100 rounded-md border border-green-300 text-center">
        <p className="text-green-700 font-medium">Transfer Completed</p>
      </div>

      <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Network:</span>
          <span className="font-medium">{currentTransaction.networkChain}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm text-gray-500">From:</span>
          <span className="font-medium">
            {currentTransaction.originTokenName}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm text-gray-500">To:</span>
          <span className="font-medium">
            {currentTransaction.destinationTokenName}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Amount:</span>
          <span className="font-medium">
            {currentTransaction.destinationAmount}
          </span>
        </div>

        <div>
          <span className="text-sm text-gray-500">Destination Address:</span>
          <div className="p-2 bg-gray-100 rounded text-xs break-all mt-1">
            {currentTransaction.destinationAddress}
          </div>
        </div>

        <div>
          <span className="text-sm text-gray-500">Transaction ID:</span>
          <div className="p-2 bg-gray-100 rounded text-xs break-all mt-1">
            {currentTransaction.id}
          </div>
        </div>

        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Date:</span>
          <span className="font-medium">
            {new Date(currentTransaction.timestamp).toLocaleString()}
          </span>
        </div>
      </div>

      <Button onClick={handleNewTransaction} className="w-full mt-2">
        New Transaction
      </Button>
    </div>
  );
}
