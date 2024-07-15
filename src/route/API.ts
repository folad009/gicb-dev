import { Router } from "express";
import authAPI from "./auth";

const api: Router = Router();

api.use("/auth", authAPI);

export default api;
