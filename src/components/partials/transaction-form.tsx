"use client";

import React, { useState } from "react";
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

const formSchema = z.object({
  destinationAddress: z.string().min(2).max(50),
  destinationAmount: z.coerce.number().min(0.01),
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    dispatch(setTransactionData(values));

    setIsLoading(true);

    setApprovalPending(true);
    const sourceTokenAddress = getTokenAddressByName(values.originTokenName);
    const sourceTokenDecimals = getTokenDecimalsByName(values.originTokenName);

    await approveToken(
      sourceTokenAddress,
      values.destinationAmount.toString(),
      sourceTokenDecimals
    );

    setApprovalPending(false);

    setIsLoading(false);

    // Move to review step
    dispatch(setStep(TransactionStep.REVIEW));
  }

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
