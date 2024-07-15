import { Request, Response, NextFunction } from "express";
import { prisma } from "../configuration/prisma"; // Adjust the import based on your project structure
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";

// Extend the Request type to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Request Headers:", req.headers);
  const token = req.headers["authorization"];

  if (!token || typeof token !== "string") {
    console.log("Authorization header missing or not a string");
    return res.status(409).json({ message: "no token provided" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number };

    const user = await prisma.user.findFirst({ where: { id: payload.userId } });

    if (!user) {
      return res.status(409).json({ message: "Unauthorized" });
    }

    req.user = user; // Attach the user to the request object
    next();
  } catch (error) {
    return res.status(409).json({ message: "Forbidden" });
  }
};

export default authMiddleware;
