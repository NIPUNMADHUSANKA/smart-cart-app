/*
  Warnings:

  - The values [gram,litre,milliLitre] on the enum `UnitStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `result` on the `AiSuggestion` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UnitStatus_new" AS ENUM ('kg', 'piece', 'pack', 'dozen', 'box', 'g', 'l', 'ml', 'bottle', 'can', 'cup', 'other');
ALTER TABLE "public"."ShoppingItem" ALTER COLUMN "unit" DROP DEFAULT;
ALTER TABLE "ShoppingItem" ALTER COLUMN "unit" TYPE "UnitStatus_new" USING ("unit"::text::"UnitStatus_new");
ALTER TYPE "UnitStatus" RENAME TO "UnitStatus_old";
ALTER TYPE "UnitStatus_new" RENAME TO "UnitStatus";
DROP TYPE "public"."UnitStatus_old";
ALTER TABLE "ShoppingItem" ALTER COLUMN "unit" SET DEFAULT 'kg';
COMMIT;

-- AlterTable
ALTER TABLE "AiSuggestion" DROP COLUMN "result";

-- CreateTable
CREATE TABLE "AICategory" (
    "id" TEXT NOT NULL,
    "suggestionId" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "priority" "PriorityStatus" NOT NULL DEFAULT 'normal',

    CONSTRAINT "AICategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIItem" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION,
    "unit" "UnitStatus",
    "priority" "PriorityStatus",

    CONSTRAINT "AIItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AICategory" ADD CONSTRAINT "AICategory_suggestionId_fkey" FOREIGN KEY ("suggestionId") REFERENCES "AiSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIItem" ADD CONSTRAINT "AIItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "AICategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

