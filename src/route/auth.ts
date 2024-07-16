import { Router } from "express";
import {
  deleteUser,
  login,
  logoutUser,
  me,
  signup,
  searchUsers,
  searchUserById,
  getUsers,
  updateProfile,
} from "../controller/auth";
import authMiddleware from "../middleware/auth";

const authAPI: Router = Router();

authAPI.post("/signup", signup);
authAPI.post("/login", login);
authAPI.get("/me", authMiddleware, me);
authAPI.delete("/user/:userId", authMiddleware, deleteUser);
authAPI.post("/logout", authMiddleware, logoutUser);
authAPI.get("/users/search", authMiddleware, searchUsers);
authAPI.get("/user/:id", authMiddleware, searchUserById);
authAPI.get("/users", authMiddleware, getUsers);
authAPI.put("/user/:userId", authMiddleware, updateProfile);

export default authAPI;
