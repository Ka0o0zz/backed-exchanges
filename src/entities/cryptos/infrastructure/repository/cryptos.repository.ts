import { cryptocurrencies } from "../../../../helpers/cryptocurrencies";
import { ExchangesCompare } from "../../domain/cryptos.domain.interface";
import {
  comparePricesForSymbols,
  displayLargestDifference,
  predictFutureBitcoin,
} from "../functions/cryptos.functions";

export class CryptosRepository {
  exchangesCompare: ExchangesCompare[];
  constructor() {
    this.exchangesCompare = [];
  }

  public async comparePrices() {
    const listExchangesCompare = await comparePricesForSymbols(
      cryptocurrencies
    );

    this.exchangesCompare = listExchangesCompare;
    const percentageDifference = displayLargestDifference(
      this.exchangesCompare
    );
    return {
      listExchangesCompare,
      percentageDifference,
    };
  }

  public async predictFutureBitcoin(days: string = "0") {
    const numOfDays = parseInt(days);
    const futureBitcoin = predictFutureBitcoin(numOfDays);
    return futureBitcoin;
  }
}
