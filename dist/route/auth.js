"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controller/auth");
const auth_2 = __importDefault(require("../middleware/auth"));
const authAPI = (0, express_1.Router)();
authAPI.post("/signup", auth_1.signup);
authAPI.post("/login", auth_1.login);
authAPI.get("/me", auth_2.default, auth_1.me);
authAPI.delete("/:userId", auth_2.default, auth_1.deleteUser);
authAPI.post("/logout", auth_2.default, auth_1.logoutUser);
authAPI.get("/search", auth_2.default, auth_1.searchUsers);
exports.default = authAPI;
