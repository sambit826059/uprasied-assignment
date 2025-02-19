/*
  Warnings:

  - The values [Decomissioned] on the enum `GadgetStatusEnum` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `decomissionedAt` on the `Gadgets` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GadgetStatusEnum_new" AS ENUM ('Available', 'Deployed', 'Destroyed', 'decomissionedAt');
ALTER TABLE "Gadgets" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Gadgets" ALTER COLUMN "status" TYPE "GadgetStatusEnum_new" USING ("status"::text::"GadgetStatusEnum_new");
ALTER TYPE "GadgetStatusEnum" RENAME TO "GadgetStatusEnum_old";
ALTER TYPE "GadgetStatusEnum_new" RENAME TO "GadgetStatusEnum";
DROP TYPE "GadgetStatusEnum_old";
ALTER TABLE "Gadgets" ALTER COLUMN "status" SET DEFAULT 'Available';
COMMIT;

-- AlterTable
ALTER TABLE "Gadgets" DROP COLUMN "decomissionedAt",
ADD COLUMN     "decommissionedAt" TIMESTAMP(3);
