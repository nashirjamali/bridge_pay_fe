import { parseUnits } from "viem";
import { useWriteContract } from "wagmi";
import {
  BRIDGE_PAY_ADDRESS,
  BRIDGE_PAY_ABI,
  ERC20_ABI,
} from "@/lib/constants/contracts";
import SUPPORTED_TOKENS from "@/lib/constants/supportedTokens";

export function useBridgePayContract() {
  const { writeContractAsync } = useWriteContract();

  const approveToken = async (
    tokenAddress: string,
    amount: string,
    decimals: number
  ) => {
    try {
      const parsedAmount = parseUnits(amount, decimals);
      return await writeContractAsync({
        address: `0x${tokenAddress}`,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [BRIDGE_PAY_ADDRESS, parsedAmount],
      });
    } catch (error) {
      console.error("Error approving token:", error);
      throw error;
    }
  };

  const executeBridgeTransfer = async (
    recipient: string,
    sourceToken: string,
    destinationToken: string,
    amount: string,
    sourceDecimals: number,
    minDestinationAmount: string,
    minDestinationDecimals: number
  ) => {
    try {
      const sourceAmount = parseUnits(amount, sourceDecimals);
      const minAmount = parseUnits(
        minDestinationAmount,
        minDestinationDecimals
      );

      const deadline = Math.floor(Date.now() / 1000) + 30 * 60;

      return await writeContractAsync({
        address: BRIDGE_PAY_ADDRESS,
        abi: BRIDGE_PAY_ABI,
        functionName: "bridgeTransfer",
        args: [
          recipient,
          sourceToken,
          destinationToken,
          sourceAmount,
          minAmount,
          deadline,
        ],
      });
    } catch (error) {
      console.error("Error executing bridge transfer:", error);
      throw error;
    }
  };

  return {
    approveToken,
    executeBridgeTransfer,
  };
}

export function getTokenAddressByName(tokenName: string) {
  const token = Object.entries(SUPPORTED_TOKENS).find(
    ([key]) => key === tokenName
  );

  if (!token) {
    throw new Error(`Token ${tokenName} not supported`);
  }

  return token[1].address;
}

export function getTokenDecimalsByName(tokenName: string) {
  const token = Object.entries(SUPPORTED_TOKENS).find(
    ([key]) => key === tokenName
  );

  if (!token) {
    throw new Error(`Token ${tokenName} not supported`);
  }

  return token[1].decimals;
}
