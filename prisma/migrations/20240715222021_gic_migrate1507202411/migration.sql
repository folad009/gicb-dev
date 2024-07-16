/*
  Warnings:

  - You are about to drop the column `pictures` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "pictures",
ADD COLUMN     "business_pictures" TEXT[],
ALTER COLUMN "business_name" DROP NOT NULL,
ALTER COLUMN "business_category" DROP NOT NULL,
ALTER COLUMN "business_description" DROP NOT NULL,
ALTER COLUMN "business_address" DROP NOT NULL,
ALTER COLUMN "profile_picture" DROP NOT NULL,
ALTER COLUMN "website_url" DROP NOT NULL,
ALTER COLUMN "social_media_handle" DROP NOT NULL,
ALTER COLUMN "cac_certificate" DROP NOT NULL,
ALTER COLUMN "business_type" DROP NOT NULL;
