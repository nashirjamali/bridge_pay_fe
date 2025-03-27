"use client";

import { useAppSelector } from "@/lib/hooks";
import TransactionStepper from "@/components/partials/transaction-stepper";
import TransactionForm from "@/components/partials/transaction-form";
import TransactionReview from "@/components/partials/transaction-review";
import TransactionConfirmation from "@/components/partials/transaction-confirmation";
import { TransactionStep } from "@/lib/features/transaction/transactionSlice";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function Home() {
  const { currentStep } = useAppSelector((state) => state.transactions);

  // Render the appropriate component based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case TransactionStep.FORM:
        return <TransactionForm />;
      case TransactionStep.REVIEW:
        return <TransactionReview />;
      case TransactionStep.CONFIRMATION:
        return <TransactionConfirmation />;
      default:
        return <TransactionForm />;
    }
  };

  // Determine card title based on step
  const getStepTitle = () => {
    switch (currentStep) {
      case TransactionStep.FORM:
        return "Transfer Details";
      case TransactionStep.REVIEW:
        return "Review Transaction";
      case TransactionStep.CONFIRMATION:
        return "Transaction Complete";
      default:
        return "BridgePay";
    }
  };

  // Determine card description based on step
  const getStepDescription = () => {
    switch (currentStep) {
      case TransactionStep.FORM:
        return "Enter your transfer details";
      case TransactionStep.REVIEW:
        return "Please confirm your transaction details";
      case TransactionStep.CONFIRMATION:
        return "Your transfer has been processed successfully";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gradient-to-b from-gray-50 to-gray-100">
      {/* 3D Keys Header */}
      <div className="w-full mb-8 text-center relative">
        <div className="absolute -top-16 left-0 right-0 flex justify-center opacity-80 pointer-events-none"></div>
        <h1 className="text-4xl font-bold mt-8">BridgePay</h1>
        <p className="text-gray-600">Cross-chain token transfers made simple</p>
      </div>

      <main className="w-full max-w-md">
        <Card className="w-full shadow-xl border-0 overflow-hidden">
          <CardHeader className="pb-0">
            <CardTitle className="text-xl font-bold text-center">
              {getStepTitle()}
            </CardTitle>
            <CardDescription className="text-center">
              {getStepDescription()}
            </CardDescription>
            <div className="pt-4">
              <TransactionStepper />
            </div>
          </CardHeader>
          <CardContent className="pt-6">{renderStepContent()}</CardContent>
          <CardFooter></CardFooter>
        </Card>
      </main>
    </div>
  );
}
