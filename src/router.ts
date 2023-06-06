import { Router } from "express";
import cryptosRouter from "./entities/cryptos/infrastructure/network/cryptos.network";

export class AppRouter {
  private router: Router;
  private apiPath = {
    cryptos: "/api/cryptos",
  };

  constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.use(this.apiPath.cryptos, cryptosRouter);
  }

  public get appRouter() {
    return this.router;
  }
}
