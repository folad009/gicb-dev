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
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUserById = exports.searchUsers = exports.deleteUser = exports.logoutUser = exports.me = exports.login = exports.signup = void 0;
const secrets_1 = require("../secrets");
const bcrypt_1 = require("bcrypt");
const bcrypt_2 = require("bcrypt");
const jwt = __importStar(require("jsonwebtoken"));
const prisma_1 = require("../configuration/prisma");
const ser_1 = require("../schema/ser");
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    ser_1.SignupSchema.parse(req.body);
    try {
        const { first_name, last_name, email, password, business_name, business_category, business_type, business_description, business_address, profile_picture, website_url, social_media_handle, contact_number, cac_certificate, } = req.body;
        // Check if user already exists
        let user = yield prisma_1.prisma.user.findFirst({ where: { email } });
        if (user) {
            return res
                .status(409)
                .json({ message: "A user with this email already exists" });
        }
        // Create the new user
        user = yield prisma_1.prisma.user.create({
            data: {
                first_name,
                last_name,
                email,
                password: (0, bcrypt_1.hashSync)(password, 10),
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
    }
    catch (err) {
        next(err);
    }
});
exports.signup = signup;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        let user = yield prisma_1.prisma.user.findFirst({ where: { email } });
        if (!user) {
            return res.status(409).json({ message: "User does not exist" });
        }
        if (!(0, bcrypt_2.compareSync)(password, user.password)) {
            return res.status(409).json({ message: `Incorrect password` });
        }
        const token = jwt.sign({
            userId: user.id,
        }, secrets_1.JWT_SECRET);
        res.json({ user, token });
    }
    catch (err) {
        next(err);
    }
});
exports.login = login;
const me = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(req.user);
});
exports.me = me;
const logoutUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({ message: "User logged out successfully" });
    }
    catch (err) {
        next(err);
    }
});
exports.logoutUser = logoutUser;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        // Check if user exists
        const user = yield prisma_1.prisma.user.findUnique({
            where: { id: userId },
        });
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
const searchUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { business_category, business_type, business_address } = req.query;
        // Build the search criteria object dynamically
        const searchCriteria = {};
        if (business_category) {
            searchCriteria.business_category = business_category;
        }
        if (business_type) {
            searchCriteria.business_type = business_type;
        }
        if (business_address) {
            searchCriteria.business_address = {
                contains: business_address,
            };
        }
        // Fetch users based on the search criteria
        const users = yield prisma_1.prisma.user.findMany({
            where: searchCriteria,
        });
        res.json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.searchUsers = searchUsers;
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
