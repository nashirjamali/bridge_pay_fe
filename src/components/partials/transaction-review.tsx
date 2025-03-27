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
          onClick={() => dispatch(setStep(TransactionStep.FORM))}
          className="w-full bg-black hover:bg-gray-800 text-white py-5 rounded-lg"
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
      <div className="space-y-5 bg-gray-50 p-5 rounded-lg">
        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
          <span className="text-sm text-gray-500">Network Chain:</span>
          <span className="font-medium">{currentTransaction.networkChain}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">From:</span>
          <span className="font-medium text-right">
            {currentTransaction.originTokenName}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">To:</span>
          <span className="font-medium text-right">
            {currentTransaction.destinationTokenName}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Amount:</span>
          <span className="font-medium text-right">
            {currentTransaction.destinationAmount}
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-sm text-gray-500">Destination Address:</span>
          <div className="p-3 bg-gray-100 rounded-lg text-xs font-mono break-all">
            {currentTransaction.destinationAddress}
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="text-sm text-gray-500">Estimated Fee:</span>
          <span className="font-medium text-right">0.0005 ETH</span>
        </div>
      </div>

      <div className="border-t pt-5 flex space-x-3">
        <Button
          onClick={handleBack}
          variant="outline"
          className="flex-1 h-12 border-gray-300 hover:bg-gray-100 hover:text-gray-900"
        >
          Back
        </Button>
        <Button
          onClick={handleConfirm}
          className="flex-1 h-12 bg-black hover:bg-gray-800 text-white"
        >
          Confirm &amp; Transfer
        </Button>
      </div>
    </div>
  );
}
