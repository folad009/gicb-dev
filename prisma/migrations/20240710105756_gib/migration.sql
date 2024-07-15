-- CreateEnum
CREATE TYPE "BusinessCategory" AS ENUM ('Product', 'Service');

-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('Manufacturing', 'Wholesale', 'Hospitality', 'Technology', 'Finance', 'Healthcare', 'Agriculture');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "business_name" TEXT NOT NULL,
    "business_category" "BusinessCategory" NOT NULL,
    "business_type" TEXT NOT NULL,
    "business_description" TEXT NOT NULL,
    "business_address" TEXT NOT NULL,
    "profile_picture" TEXT NOT NULL,
    "website_url" TEXT NOT NULL,
    "social_media_handle" TEXT NOT NULL,
    "contact_number" TEXT NOT NULL,
    "cac_certificate" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_business_name_key" ON "users"("business_name");
