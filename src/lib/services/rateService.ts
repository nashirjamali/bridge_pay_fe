const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";

const TOKEN_ID_MAPPING: { [key: string]: string } = {
  ETH: "ethereum",
  WETH: "weth",
  USDC: "usd-coin",
};

export async function getTokenPrices(
  tokens: string[]
): Promise<Record<string, number>> {
  try {
    const validTokens = tokens.filter((token) => TOKEN_ID_MAPPING[token]);
    const tokenIds = validTokens
      .map((token) => TOKEN_ID_MAPPING[token])
      .join(",");

    if (!tokenIds) return {};

    const response = await fetch(
      `${COINGECKO_API_URL}/simple/price?ids=${tokenIds}&vs_currencies=usd`
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();

    const result: Record<string, number> = {};
    validTokens.forEach((token) => {
      const coinId = TOKEN_ID_MAPPING[token];
      if (data[coinId] && data[coinId].usd) {
        result[token] = data[coinId].usd;
      }
    });

    return result;
  } catch (error) {
    console.error("Error fetching token prices:", error);
    throw error;
  }
}

export async function getTokenExchangeRate(
  sourceToken: string,
  destinationToken: string
): Promise<number> {
  if (sourceToken === destinationToken) return 1;

  try {
    const prices = await getTokenPrices([sourceToken, destinationToken]);

    if (!prices[sourceToken] || !prices[destinationToken]) {
      throw new Error(
        `Couldn't get prices for ${sourceToken} or ${destinationToken}`
      );
    }

    const rate = prices[sourceToken] / prices[destinationToken];
    return rate;
  } catch (error) {
    console.error("Error calculating exchange rate:", error);

    throw new Error(
      `Failed to get exchange rate for ${sourceToken} to ${destinationToken}`
    );
  }
}

export async function estimateDestinationAmount(
  sourceToken: string,
  destinationToken: string,
  amount: number
): Promise<number> {
  const rate = await getTokenExchangeRate(sourceToken, destinationToken);
  return amount * rate;
}

export async function estimateSourceAmount(
  sourceToken: string,
  destinationToken: string,
  destinationAmount: number
): Promise<number> {
  const rate = await getTokenExchangeRate(sourceToken, destinationToken);
  return destinationAmount / rate;
}
