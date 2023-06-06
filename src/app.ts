import dotenv from "dotenv";
dotenv.config({ path: ".env.development" });
import { Server } from "./server";

export const server = new Server();

server.listen();
