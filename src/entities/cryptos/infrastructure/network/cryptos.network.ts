import { Router } from "express";
import { CryptosRepository } from "../repository/cryptos.repository";
import { asyncMiddleware } from "../../../../middlewares/asyncMiddleware";
import { CryptosUseCase } from "../../application/cryptos.useCases";
import { CryptosController } from "../controller/cryptos.controller";
import { errorCryptosHandlerMiddleware } from "../errors/cryptos.errors";

enum NEWS_API_PATS {
  COMPARE_PRICES = "/",
  PREDICT_FUTURE_BITCOIN = "/predict-future-bitcoin",
}

const cryptosRepository = new CryptosRepository();
const cryptosUseCase = new CryptosUseCase(cryptosRepository);
const cryptosCtrl = new CryptosController(cryptosUseCase);

const router = Router();

router.get(
  NEWS_API_PATS.COMPARE_PRICES,
  asyncMiddleware(cryptosCtrl.getComparePricesCtrl)
);

router.get(
  NEWS_API_PATS.PREDICT_FUTURE_BITCOIN,
  asyncMiddleware(cryptosCtrl.getPredictFutureBitcoinCtrl)
);

router.use(errorCryptosHandlerMiddleware);

export default router;
