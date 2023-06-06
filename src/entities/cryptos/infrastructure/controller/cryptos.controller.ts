import { Request, Response } from "express";
import { CryptosUseCase } from "../../application/cryptos.useCases";

export class CryptosController {
  constructor(private cryptosUseCase: CryptosUseCase) {}

  public getComparePricesCtrl = async (_req: Request, res: Response) => {
    const listExchangesCompare = await this.cryptosUseCase.comparePrices();
    res.status(200).json({
      ok: true,
      listExchangesCompare,
    });
  };

  public getPredictFutureBitcoinCtrl = async (req: Request, res: Response) => {
    const { days } = req.query;
    const futureBitcoin = await this.cryptosUseCase.predictFutureBitcoin(
      days as string
    );
    res.status(200).json({
      ok: true,
      futureBitcoin,
    });
  };
}
