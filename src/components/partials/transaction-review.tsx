"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  confirmTransaction,
  setStep,
  TransactionStep,
} from "@/lib/features/transaction/transactionSlice";
import {
  getTokenAddressByName,
  getTokenDecimalsByName,
  useBridgePayContract,
} from "@/lib/features/transaction/contractInteraction";

export default function TransactionReview() {
  const dispatch = useAppDispatch();
  const { currentTransaction } = useAppSelector((state) => state.transactions);

  const { executeBridgeTransfer } = useBridgePayContract();
  const [processingStatus, setProcessingStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const handleConfirm = async () => {
    setIsLoading(true);

    setProcessingStatus("Initializing bridge transfer...");

    const sourceTokenAddress = getTokenAddressByName(
      currentTransaction.originTokenName
    );
    const destinationTokenAddress = getTokenAddressByName(
      currentTransaction.destinationTokenName
    );
    const sourceDecimals = getTokenDecimalsByName(
      currentTransaction.originTokenName
    );
    const destDecimals = getTokenDecimalsByName(
      currentTransaction.destinationTokenName
    );

    const minDestinationAmount = (
      currentTransaction.destinationAmount * 0.95
    ).toString();

    setProcessingStatus("Executing bridge transfer...");

    await executeBridgeTransfer(
      currentTransaction.destinationAddress,
      `0x${sourceTokenAddress}`,
      `0x${destinationTokenAddress}`,
      currentTransaction.destinationAmount.toString(),
      sourceDecimals,
      minDestinationAmount,
      destDecimals
    );

    setProcessingStatus("Transaction confirmed, waiting for completion...");

    dispatch(confirmTransaction());

    setIsLoading(false);
  };

  const platformFeeRate = 0.003;
  const estimatedFee = (
    currentTransaction.destinationAmount * platformFeeRate
  ).toFixed(5);

  return (
    <div className="space-y-4">
      <div className="space-y-5 bg-gray-50 p-5 rounded-lg">
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
            {currentTransaction.destinationAmount}{" "}
            {currentTransaction.destinationTokenName}
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-sm text-gray-500">Destination Address:</span>
          <div className="p-3 bg-gray-100 rounded-lg text-xs font-mono break-all">
            {currentTransaction.destinationAddress}
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="text-sm text-gray-500">Estimated Fee (0.3%):</span>
          <span className="font-medium text-right">
            {estimatedFee} {currentTransaction.destinationTokenName}
          </span>
        </div>

        {/* Slippage information */}
        <div className="flex justify-between items-center pt-2">
          <span className="text-sm text-gray-500">Slippage Tolerance:</span>
          <span className="font-medium text-right">5%</span>
        </div>
      </div>

      {isLoading && processingStatus && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <svg
              className="animate-spin h-5 w-5 mr-3 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-blue-700">{processingStatus}</p>
          </div>
        </div>
      )}

      <div className="border-t pt-5 flex space-x-3">
        <Button
          onClick={handleBack}
          variant="outline"
          className="flex-1 h-12 border-gray-300 hover:bg-gray-100 hover:text-gray-900"
          disabled={isLoading}
        >
          Back
        </Button>
        <Button
          onClick={handleConfirm}
          className="flex-1 h-12 bg-black hover:bg-gray-800 text-white"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Confirm & Transfer"}
        </Button>
      </div>
    </div>
  );
}
