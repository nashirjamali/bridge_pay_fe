"use client";

import React from "react";
import { useAppSelector } from "@/lib/hooks";
import { TransactionStep } from "@/lib/features/transaction/transactionSlice";

export default function TransactionStepper() {
  const { currentStep } = useAppSelector((state) => state.transactions);

  const steps = [
    { key: TransactionStep.FORM, label: "Details" },
    { key: TransactionStep.REVIEW, label: "Review" },
    { key: TransactionStep.CONFIRMATION, label: "Confirmation" },
  ];

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isActive = currentStep === step.key;
          const isCompleted =
            (currentStep === TransactionStep.REVIEW && index === 0) ||
            currentStep === TransactionStep.CONFIRMATION;

          return (
            <React.Fragment key={step.key}>
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
                    ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                >
                  {isCompleted ? (
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`text-xs mt-1 ${isActive ? "font-medium" : ""}`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line between circles */}
              {index < steps.length - 1 && (
                <div className="flex-1 flex items-center">
                  <div
                    className={`h-0.5 w-full 
                      ${
                        (isActive && index === 0) || isCompleted
                          ? "bg-green-500"
                          : "bg-gray-200"
                      }`}
                  ></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
