import { Router } from "express";
import { deleteUser, login, logoutUser, me, signup, searchUsers } from "../controller/auth";
import authMiddleware from "../middleware/auth";

const authAPI: Router = Router();

authAPI.post("/signup", signup);
authAPI.post("/login", login);
authAPI.get("/me", authMiddleware, me);
authAPI.delete("/:userId", authMiddleware, deleteUser);
authAPI.post("/logout", authMiddleware, logoutUser);
authAPI.get("/search", authMiddleware, searchUsers)

export default authAPI;
