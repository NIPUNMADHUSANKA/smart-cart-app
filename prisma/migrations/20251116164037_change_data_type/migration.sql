/*
  Warnings:

  - The `unit` column on the `ShoppingItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `quantity` on the `ShoppingItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UnitStatus" AS ENUM ('kg', 'piece', 'pack', 'dozen', 'box', 'gram', 'litre', 'milliLitre', 'bottle', 'can', 'cup', 'other');

-- AlterTable
ALTER TABLE "ShoppingItem" DROP COLUMN "quantity",
ADD COLUMN     "quantity" INTEGER NOT NULL,
DROP COLUMN "unit",
ADD COLUMN     "unit" "UnitStatus" NOT NULL DEFAULT 'kg';
