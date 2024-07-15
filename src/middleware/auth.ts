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

  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    console.log("Authorization header missing");
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    console.log("Token missing after splitting the authorization header");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };

    const user = await prisma.user.findFirst({ where: { id: payload.userId } });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user; // Attach the user to the request object
    next();
  } catch (error) {
    console.error("Error during token verification or user retrieval:", error);
    return res.status(403).json({ message: "Forbidden" });
  }
};
export default authMiddleware;
