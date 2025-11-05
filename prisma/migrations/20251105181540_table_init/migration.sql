-- CreateEnum
CREATE TYPE "CategoryStatus" AS ENUM ('active', 'completed');

-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('active', 'archived');

-- CreateEnum
CREATE TYPE "PriorityStatus" AS ENUM ('normal', 'low', 'medium', 'high');

-- CreateTable
CREATE TABLE "Category" (
    "categoryId" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "CategoryStatus" NOT NULL DEFAULT 'active',
    "userId" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "priority" "PriorityStatus" NOT NULL DEFAULT 'normal',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("categoryId")
);

-- CreateTable
CREATE TABLE "ShoppingItem" (
    "itemId" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "status" "ItemStatus" NOT NULL DEFAULT 'active',
    "categoryId" TEXT NOT NULL,
    "priority" "PriorityStatus" NOT NULL DEFAULT 'normal',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShoppingItem_pkey" PRIMARY KEY ("itemId")
);

-- AddForeignKey
ALTER TABLE "ShoppingItem" ADD CONSTRAINT "ShoppingItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("categoryId") ON DELETE RESTRICT ON UPDATE CASCADE;
