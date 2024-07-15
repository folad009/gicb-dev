import express, { Express, Request, Response, NextFunction } from "express";
import { PORT } from "./secrets";
import api from "./route/API";

const app: Express = express();

app.use(express.json());

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("GIBC-MASTER");
});

app.use("/api/v1", api);

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
