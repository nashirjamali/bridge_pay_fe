"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  setTransactionData,
  setStep,
  TransactionStep,
} from "@/lib/features/transaction/transactionSlice";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  getTokenAddressByName,
  getTokenDecimalsByName,
  useBridgePayContract,
} from "@/lib/features/transaction/contractInteraction";
import SUPPORTED_TOKENS from "@/lib/constants/supportedTokens";
import {
  estimateSourceAmount,
  getTokenExchangeRate,
} from "@/lib/services/rateService";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const formSchema = z.object({
  destinationAddress: z.string().min(2).max(50),
  destinationAmount: z.coerce.number().min(0.0001),
  destinationTokenName: z.string().min(2).max(50),
  originTokenName: z.string().min(2).max(50),
});

export default function TransactionForm() {
  const dispatch = useAppDispatch();
  const { currentTransaction } = useAppSelector((state) => state.transactions);

  const { isConnected } = useAccount();
  const { approveToken } = useBridgePayContract();

  const [approvalPending, setApprovalPending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sourceAmount, setSourceAmount] = useState<number | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [estimationLoading, setEstimationLoading] = useState(false);
  const [estimationError, setEstimationError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: currentTransaction
      ? {
          destinationAddress: currentTransaction.destinationAddress,
          destinationAmount: currentTransaction.destinationAmount,
          destinationTokenName: currentTransaction.destinationTokenName,
          originTokenName: currentTransaction.originTokenName,
        }
      : {
          destinationAddress: "",
          destinationAmount: 0,
          destinationTokenName: "",
          originTokenName: "",
        },
  });

  const originToken = form.watch("originTokenName");
  const destinationToken = form.watch("destinationTokenName");
  const destinationAmount = form.watch("destinationAmount");

  useEffect(() => {
    async function updateEstimation() {
      if (!originToken || !destinationToken || !destinationAmount) {
        setSourceAmount(null);
        setExchangeRate(null);
        return;
      }

      try {
        setEstimationLoading(true);
        setEstimationError(null);

        const rate = await getTokenExchangeRate(originToken, destinationToken);
        setExchangeRate(rate);

        const estimatedSourceAmount = await estimateSourceAmount(
          originToken,
          destinationToken,
          destinationAmount
        );

        setSourceAmount(estimatedSourceAmount);
        setEstimationLoading(false);
      } catch (error) {
        console.error("Error estimating amount:", error);
        setEstimationError("Failed to estimate amount");
        setEstimationLoading(false);
      }
    }

    updateEstimation();
  }, [originToken, destinationToken, destinationAmount]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    dispatch(setTransactionData(values));

    setIsLoading(true);

    setApprovalPending(true);
    const sourceTokenAddress = getTokenAddressByName(values.originTokenName);
    const sourceTokenDecimals = getTokenDecimalsByName(values.originTokenName);

    let amountToApprove = sourceAmount;
    if (!amountToApprove) {
      amountToApprove = await estimateSourceAmount(
        values.originTokenName,
        values.destinationTokenName,
        values.destinationAmount
      );
    }

    const sourceAmountWithBuffer = amountToApprove * 1.05;

    const formattedSourceAmount =
      sourceAmountWithBuffer.toFixed(sourceTokenDecimals);

    await approveToken(
      sourceTokenAddress,
      formattedSourceAmount,
      sourceTokenDecimals
    );

    setApprovalPending(false);

    setIsLoading(false);

    // Move to review step
    dispatch(setStep(TransactionStep.REVIEW));
  }

  const formatAmount = (amount: number) => {
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="destinationAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destination Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="Input destination address wallet"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="destinationTokenName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destination Token</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select destination token" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(SUPPORTED_TOKENS).map((token) => (
                      <SelectItem key={token} value={token}>
                        {token}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="destinationAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  placeholder="Input destination amount"
                  type="number"
                  step="0.01"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="originTokenName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Origin Token</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select origin token" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(SUPPORTED_TOKENS).map((token) => (
                      <SelectItem key={token} value={token}>
                        {token}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {originToken && destinationToken && destinationAmount > 0 && (
          <Card className="mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Estimated Exchange</CardTitle>
            </CardHeader>
            <CardContent>
              {estimationLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent mr-2"></div>
                  <span className="text-sm text-gray-500">
                    Calculating rates...
                  </span>
                </div>
              ) : estimationError ? (
                <div className="text-red-500 text-sm">{estimationError}</div>
              ) : sourceAmount && exchangeRate ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Exchange Rate:</span>
                    <span>
                      1 {originToken} ≈ {formatAmount(exchangeRate)}{" "}
                      {destinationToken}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>{"You'll send:"}</span>
                    <span>
                      {formatAmount(sourceAmount)} {originToken}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{"You'll receive:"}</span>
                    <span>
                      {formatAmount(destinationAmount)} {destinationToken}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 pt-2">
                    Rate provided by CoinGecko. Actual amounts may vary due to
                    slippage and market fluctuations.
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        )}
        {!isConnected ? (
          <ConnectButton label="Connect Wallet" />
        ) : isLoading ? (
          <Button className="w-full" disabled>
            {approvalPending ? "Approving Token..." : "Processing..."}
          </Button>
        ) : (
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            Continue to Review
          </Button>
        )}
      </form>
    </Form>
  );
}
