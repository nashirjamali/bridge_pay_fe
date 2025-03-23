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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-primary">
      <main className="">
        <Card className="w-96">
          <CardHeader>
            <TransactionStepper />
          </CardHeader>
          <CardContent>{renderStepContent()}</CardContent>
          <CardFooter></CardFooter>
        </Card>
      </main>
    </div>
  );
}
