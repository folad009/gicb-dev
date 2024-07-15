/*
  Warnings:

  - Changed the type of `business_type` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "business_type",
ADD COLUMN     "business_type" "BusinessType" NOT NULL;
