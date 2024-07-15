import { z } from "zod";

export const SignupSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  business_name: z.string(),
  business_category: z.string(), 
  business_type: z.string(),
  business_description: z.string(),
  business_address: z.string(),
  profile_picture: z.string().url(),
  website_url: z.string().url(),
  social_media_handle: z.string(),
  contact_number: z.string(),
  cac_certificate: z.string().url(),
});
