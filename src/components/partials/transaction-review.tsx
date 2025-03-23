"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  confirmTransaction,
  setStep,
  TransactionStep,
} from "@/lib/features/transaction/transactionSlice";

export default function TransactionReview() {
  const dispatch = useAppDispatch();
  const { currentTransaction } = useAppSelector((state) => state.transactions);

  if (!currentTransaction) {
    return (
      <div className="text-center p-4">
        <p>No transaction data found.</p>
        <Button
          onClick={() => dispatch(setStep(TransactionStep.FORM))}
          className="w-full mt-4"
        >
          Back to Form
        </Button>
      </div>
    );
  }

  const handleBack = () => {
    dispatch(setStep(TransactionStep.FORM));
  };

  const handleConfirm = () => {
    dispatch(confirmTransaction());
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold">Review Transaction</h2>
        <p className="text-sm text-gray-500">
          Please confirm your transaction details
        </p>
      </div>

      <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Network Chain:</span>
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
      </div>

      <div className="border-t pt-4 flex space-x-3">
        <Button onClick={handleBack} variant="outline" className="flex-1">
          Back
        </Button>
        <Button onClick={handleConfirm} className="flex-1">
          Confirm &amp; Transfer
        </Button>
      </div>
    </div>
  );
}
