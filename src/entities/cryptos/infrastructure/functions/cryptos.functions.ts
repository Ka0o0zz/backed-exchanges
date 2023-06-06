import axios from "axios";
import moment from "moment";
import { ExchangesCompare } from "../../domain/cryptos.domain.interface";

async function comparePrices(
  binanceSymbol: string,
  cryptoSymbol: string
): Promise<any> {
  try {
    const binanceResponse = await axios.get(
      `https://api.binance.com/api/v3/ticker/price?symbol=${binanceSymbol.toUpperCase()}USDT`
    );
    const binancePrice = parseFloat(binanceResponse.data.price);

    const cryptoResponse = await axios.get(
      `https://api.crypto.com/v2/public/get-ticker?instrument_name=${cryptoSymbol.toUpperCase()}_USDT`
    );

    const cryptoPrice = parseFloat(cryptoResponse.data.result.data[0].a);

    const MaxPrice = Math.max(binancePrice, cryptoPrice);
    const MinPrice = Math.min(binancePrice, cryptoPrice);

    const priceDifference = MaxPrice - MinPrice;
    const percentageDifference = (priceDifference / MaxPrice) * 100;

    return {
      binancePrice,
      cryptoPrice,
      percentageDifference: percentageDifference,
    };
  } catch (error) {
    throw new Error(` ${binanceSymbol} ${cryptoSymbol}`);
  }
}

export async function comparePricesForSymbols(symbolsArray: any) {
  const comparedPrices = [];

  for (const symbol of symbolsArray) {
    try {
      const { name, binanceSymbol, cryptoSymbol } = symbol;
      const priceComparison = await comparePrices(binanceSymbol, cryptoSymbol);

      const comparisonData = {
        name: name,
        binancePrice: priceComparison.binancePrice,
        cryptoPrice: priceComparison.cryptoPrice,
        percentageDifference: priceComparison.percentageDifference,
      };

      comparedPrices.push(comparisonData);
    } catch (error) {
      console.error(error);
    }
  }

  return comparedPrices;
}

export function displayLargestDifference(comparedPrices: ExchangesCompare[]) {
  let largestDifference = 0;
  let largestDifferenceAsset: ExchangesCompare | null = null;

  for (const priceData of comparedPrices) {
    const percentageDifference = Math.abs(priceData.percentageDifference);

    if (percentageDifference > Math.abs(largestDifference)) {
      largestDifference = priceData.percentageDifference;
      largestDifferenceAsset = priceData;
    }
  }

  if (largestDifferenceAsset) {
    const { name, binancePrice, cryptoPrice } = largestDifferenceAsset;
    const exchangeWithHigherPrice =
      binancePrice > cryptoPrice ? "Binance" : "Crypto.com";
    const exchangeWithLowerPrice =
      binancePrice > cryptoPrice ? "Crypto.com" : "Binance";

    const result = {
      highest: {
        exchange: exchangeWithLowerPrice,
        name,
        price:
          exchangeWithLowerPrice === "Binance" ? binancePrice : cryptoPrice,

        difference: largestDifference,
      },
      lowest: {
        exchange: exchangeWithHigherPrice,
        name,
        price:
          exchangeWithHigherPrice === "Binance" ? binancePrice : cryptoPrice,
        difference: largestDifference,
      },
    };

    return result;
  } else {
    console.log("No percentage difference found.");
  }
}

export const predictFutureBitcoin = async (days: number) => {
  async function getHistoricalData() {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1617&interval=daily`
    );

    const prices = response.data.prices;

    const historicalData = prices.map((price: [number, number]) => {
      const timestamp = price[0];
      const date = moment(timestamp).format("YYYY-MM-DD");
      const value = price[1];

      return { date, value };
    });

    return historicalData;
  }

  async function predictFuturePrices(
    historicalData: { date: string; value: number }[],
    numDays: number
  ) {
    const n = historicalData.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    historicalData.forEach((data) => {
      const x = moment(data.date).unix();
      const y = data.value;

      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;
    });

    const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const b = (sumY - m * sumX) / n;

    const futurePrices: { date: string; value: number }[] = [];

    for (let i = 1; i <= numDays; i++) {
      const futureDate = moment(historicalData[n - 1].date)
        .add(i, "days")
        .format("YYYY-MM-DD");
      const value = m * moment(futureDate).unix() + b;
      futurePrices.push({ date: futureDate, value });
    }

    return futurePrices;
  }

  const historicalData = await getHistoricalData();
  const futurePrices = await predictFuturePrices(historicalData, days);

  return {
    historicalData: [...historicalData, ...futurePrices],
    todayPrice: historicalData[historicalData.length - 1].value,
    futurePrice: futurePrices[futurePrices.length - 1]?.value ?? 0,
  };
};
