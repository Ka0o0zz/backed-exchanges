import { CryptosRepository } from "../infrastructure/repository/cryptos.repository";

export class CryptosUseCase {
  constructor(private readonly cryptosRepository: CryptosRepository) {}

  public comparePrices() {
    const listExchangesCompare = this.cryptosRepository.comparePrices();
    return listExchangesCompare;
  }

public predictFutureBitcoin(days?:string) {
    const percentageDifference =
      this.cryptosRepository.predictFutureBitcoin(days);
    return percentageDifference;
  }
}
