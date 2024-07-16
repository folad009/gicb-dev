/*
  Warnings:

  - You are about to drop the column `business_address` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `business_category` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `business_description` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `business_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `business_pictures` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `business_type` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `cac_certificate` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `contact_number` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `profile_picture` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `social_media_handle` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `website_url` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[businessName]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contactNumber` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_business_name_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "business_address",
DROP COLUMN "business_category",
DROP COLUMN "business_description",
DROP COLUMN "business_name",
DROP COLUMN "business_pictures",
DROP COLUMN "business_type",
DROP COLUMN "cac_certificate",
DROP COLUMN "contact_number",
DROP COLUMN "first_name",
DROP COLUMN "last_name",
DROP COLUMN "profile_picture",
DROP COLUMN "social_media_handle",
DROP COLUMN "website_url",
ADD COLUMN     "businessAddress" TEXT,
ADD COLUMN     "businessCategory" "BusinessCategory",
ADD COLUMN     "businessDescription" TEXT,
ADD COLUMN     "businessName" TEXT,
ADD COLUMN     "businessPictures" TEXT[],
ADD COLUMN     "businessType" "BusinessType",
ADD COLUMN     "cacCertificate" TEXT,
ADD COLUMN     "contactNumber" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "profilePicture" TEXT,
ADD COLUMN     "socialMediaHandle" TEXT,
ADD COLUMN     "websiteUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_businessName_key" ON "users"("businessName");
