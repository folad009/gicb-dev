"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getUsers = exports.searchUserById = exports.searchUsers = exports.deleteUser = exports.logoutUser = exports.me = exports.login = exports.signup = void 0;
const secrets_1 = require("../secrets");
const bcrypt_1 = require("bcrypt");
const jwt = __importStar(require("jsonwebtoken"));
const prisma_1 = require("../configuration/prisma");
const ser_1 = require("../schema/ser");
// Create a new user account
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the request body
        ser_1.SignupSchema.parse(req.body);
        const _a = req.body, { firstName, lastName, email, password, businessCategory, businessType } = _a, businessDetails = __rest(_a, ["firstName", "lastName", "email", "password", "businessCategory", "businessType"]);
        // Check if user already exists
        const existingUser = yield prisma_1.prisma.user.findFirst({ where: { email } });
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
        const user = yield prisma_1.prisma.user.create({
            data: Object.assign({ firstName,
                lastName,
                email, password: (0, bcrypt_1.hashSync)(password, 10), businessCategory: category, businessType: type }, businessDetails),
        });
        res.json(user);
    }
    catch (err) {
        next(err);
    }
});
exports.signup = signup;
// Login existing user
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield prisma_1.prisma.user.findFirst({ where: { email } });
        if (!user) {
            return res.status(409).json({ message: "User does not exist" });
        }
        if (!(0, bcrypt_1.compareSync)(password, user.password)) {
            return res.status(409).json({ message: "Incorrect password" });
        }
        const token = jwt.sign({ userId: user.id }, secrets_1.JWT_SECRET);
        res.json({ user, token });
    }
    catch (err) {
        next(err);
    }
});
exports.login = login;
// Authenticate user that login
const me = (req, res) => {
    res.json(req.user);
};
exports.me = me;
// Logout user
const logoutUser = (req, res, next) => {
    try {
        res.status(200).json({ message: "User logged out successfully" });
    }
    catch (err) {
        next(err);
    }
};
exports.logoutUser = logoutUser;
// Delete user account
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        // Check if user exists
        const user = yield prisma_1.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Delete the user
        yield prisma_1.prisma.user.delete({ where: { id: userId } });
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteUser = deleteUser;
// Filter and search business
const searchUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { businessCategory, businessType, businessAddress } = req.query;
        const searchCriteria = {};
        if (businessCategory)
            searchCriteria.businessCategory = businessCategory;
        if (businessType)
            searchCriteria.business_type = businessType;
        if (businessAddress)
            searchCriteria.business_address = {
                contains: businessAddress,
            };
        // Fetch users based on the search criteria
        const users = yield prisma_1.prisma.user.findMany({ where: searchCriteria });
        res.json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.searchUsers = searchUsers;
// Search by user ID
const searchUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield prisma_1.prisma.user.findUnique({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.searchUserById = searchUserById;
// Get all users
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma_1.prisma.user.findMany();
        res.status(200).json(users);
    }
    catch (error) {
        console.log(error);
        res.status(404).json({ message: "No users found" });
    }
});
exports.getUsers = getUsers;
// Update user profile
const updateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const _a = req.body, { password } = _a, profileDetails = __rest(_a, ["password"]);
        // Check if user exists
        const user = yield prisma_1.prisma.user.findUnique({
            where: { id: String(userId) },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Hash the password if it needs to be updated
        if (password) {
            profileDetails.password = (0, bcrypt_1.hashSync)(password, 10);
        }
        // Update the user profile
        const updatedUser = yield prisma_1.prisma.user.update({
            where: { id: String(userId) },
            data: profileDetails,
        });
        res.json(updatedUser);
    }
    catch (err) {
        next(err);
    }
});
exports.updateProfile = updateProfile;
