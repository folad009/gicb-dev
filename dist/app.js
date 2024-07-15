"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const secrets_1 = require("./secrets");
const API_1 = __importDefault(require("./route/API"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/", (req, res, next) => {
    res.send("GIBC-MASTER");
});
app.use("/api/v1", API_1.default);
app.listen(secrets_1.PORT, () => {
    console.log(`App is listening on port ${secrets_1.PORT}`);
});
