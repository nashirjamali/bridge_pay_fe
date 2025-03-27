"use client";

import React from "react";
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

const formSchema = z.object({
  networkChain: z.string().min(2).max(50),
  destinationAddress: z.string().min(2).max(50),
  destinationAmount: z.coerce.number().min(0.01),
  destinationTokenName: z.string().min(2).max(50),
  originTokenName: z.string().min(2).max(50),
});

export default function TransactionForm() {
  const dispatch = useAppDispatch();
  const { currentTransaction } = useAppSelector((state) => state.transactions);

  const { isConnected } = useAccount();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: currentTransaction
      ? {
          networkChain: currentTransaction.networkChain,
          destinationAddress: currentTransaction.destinationAddress,
          destinationAmount: currentTransaction.destinationAmount,
          destinationTokenName: currentTransaction.destinationTokenName,
          originTokenName: currentTransaction.originTokenName,
        }
      : {
          networkChain: "",
          destinationAddress: "",
          destinationAmount: 0,
          destinationTokenName: "",
          originTokenName: "",
        },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Save form data to Redux
    dispatch(setTransactionData(values));

    // Move to review step
    dispatch(setStep(TransactionStep.REVIEW));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="networkChain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Network Chain</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select network chain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BNB">BNB</SelectItem>
                    <SelectItem value="Arbitrum">Arbitrum</SelectItem>
                    <SelectItem value="Manta">Manta</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                    <SelectItem value="ETH">ETH</SelectItem>
                    <SelectItem value="USDT">USDT</SelectItem>
                    <SelectItem value="IDRX">IDRX</SelectItem>
                    <SelectItem value="wBTC">wBTC</SelectItem>
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
                    <SelectItem value="ETH">ETH</SelectItem>
                    <SelectItem value="USDT">USDT</SelectItem>
                    <SelectItem value="IDRX">IDRX</SelectItem>
                    <SelectItem value="wBTC">wBTC</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isConnected ? (
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            Continue to Review
          </Button>
        ) : (
          <ConnectButton label="Connect Wallet" />
        )}
      </form>
    </Form>
  );
}
