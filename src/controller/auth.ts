import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "../secrets";
import { hashSync } from "bcrypt";
import { compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { prisma } from "../configuration/prisma";
import { SignupSchema } from "../schema/ser";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  SignupSchema.parse(req.body);
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      business_name,
      business_category,
      business_type,
      business_description,
      business_address,
      profile_picture,
      website_url,
      social_media_handle,
      contact_number,
      cac_certificate,
    } = req.body;

    // Check if user already exists
    let user = await prisma.user.findFirst({ where: { email } });
    if (user) {
      return res
        .status(409)
        .json({ message: "A user with this email already exists" });
    }

    // Create the new user
    user = await prisma.user.create({
      data: {
        first_name,
        last_name,
        email,
        password: hashSync(password, 10),
        business_name,
        business_category,
        business_type,
        business_description,
        business_address,
        profile_picture,
        website_url,
        social_media_handle,
        contact_number,
        cac_certificate,
      },
    });

    res.json(user);
  } catch (err) {
    next(err);
  }
};
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    let user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      return res.status(409).json({ message: "User does not exist" });
    }

    if (!compareSync(password, user.password)) {
      return res.status(409).json({ message: `Incorrect password` });
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },
      JWT_SECRET
    );

    res.json({ user, token });
  } catch (err) {
    next(err);
  }
};

export const me = async (req: Request, res: Response) => {
  res.json(req.user);
};

export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
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

export const searchUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { business_category, business_type, business_address } = req.query;

    // Build the search criteria object dynamically
    const searchCriteria: any = {};

    if (business_category) {
      searchCriteria.business_category = business_category as string;
    }

    if (business_type) {
      searchCriteria.business_type = business_type as string;
    }

    if (business_address) {
      searchCriteria.business_address = {
        contains: business_address as string,
      };
    }

    // Fetch users based on the search criteria
    const users = await prisma.user.findMany({
      where: searchCriteria,
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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
