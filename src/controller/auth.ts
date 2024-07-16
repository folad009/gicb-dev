import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "../secrets";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { prisma } from "../configuration/prisma";
import { SignupSchema } from "../schema/ser";

// Create a new user account
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate the request body
    SignupSchema.parse(req.body);

    const {
      firstName,
      lastName,
      email,
      password,
      businessCategory,
      businessType,
      ...businessDetails
    } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({ where: { email } });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "A user with this email already exists" });
    }

    // Validate businessCategory
    const validBusinessCategories = ["Product", "Service"];
    const category = validBusinessCategories.includes(businessCategory)
      ? businessCategory
      : null;

    // Validate businessType
    const validBusinessTypes = [
      "Manufacturing",
      "Wholesale",
      "Hospitality",
      "Technology",
      "Finance",
      "Healthcare",
      "Agriculture",
    ];
    const type = validBusinessTypes.includes(businessType)
      ? businessType
      : null;

    // Create the new user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashSync(password, 10),
        businessCategory: category,
        businessType: type,
        ...businessDetails,
      },
    });

    res.json(user);
  } catch (err) {
    next(err);
  }
};

// Login existing user
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      return res.status(409).json({ message: "User does not exist" });
    }

    if (!compareSync(password, user.password)) {
      return res.status(409).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);

    res.json({ user, token });
  } catch (err) {
    next(err);
  }
};

// Authenticate user that login
export const me = (req: Request, res: Response) => {
  res.json(req.user);
};

// Logout user
export const logoutUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    next(err);
  }
};

// Delete user account
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user
    await prisma.user.delete({ where: { id: userId } });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// Filter and search business
export const searchUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { businessCategory, businessType, businessAddress } = req.query;

    const searchCriteria: any = {};
    if (businessCategory)
      searchCriteria.businessCategory = businessCategory as string;
    if (businessType) searchCriteria.business_type = businessType as string;
    if (businessAddress)
      searchCriteria.business_address = {
        contains: businessAddress as string,
      };

    // Fetch users based on the search criteria
    const users = await prisma.user.findMany({ where: searchCriteria });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Search by user ID
export const searchUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all users
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "No users found" });
  }
};

// Update user profile
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const { password, ...profileDetails } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: String(userId) },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the password if it needs to be updated
    if (password) {
      profileDetails.password = hashSync(password, 10);
    }

    // Update the user profile
    const updatedUser = await prisma.user.update({
      where: { id: String(userId) },
      data: profileDetails,
    });

    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};
