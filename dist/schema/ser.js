"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignupSchema = void 0;
const zod_1 = require("zod");
exports.SignupSchema = zod_1.z.object({
    first_name: zod_1.z.string(),
    last_name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    business_name: zod_1.z.string(),
    business_category: zod_1.z.string(),
    business_type: zod_1.z.string(),
    business_description: zod_1.z.string(),
    business_address: zod_1.z.string(),
    profile_picture: zod_1.z.string().url(),
    website_url: zod_1.z.string().url(),
    social_media_handle: zod_1.z.string(),
    contact_number: zod_1.z.string(),
    cac_certificate: zod_1.z.string().url(),
});
