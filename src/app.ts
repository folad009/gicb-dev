import express, { Express, Request, Response, NextFunction } from "express";
import { PORT } from "./secrets";
import api from "./route/API";
import cors from "cors";

const app: Express = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Welcome to Global Impact Business Community");
});

app.use("/api/v1", api);

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
