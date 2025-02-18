-- CreateEnum
CREATE TYPE "GadgetStatusEnum" AS ENUM ('Available', 'Deployed', 'Destroyed', 'Decomissioned');

-- CreateTable
CREATE TABLE "Gadgets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "GadgetStatusEnum" DEFAULT 'Available',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "decomissionedAt" TIMESTAMP(3),

    CONSTRAINT "Gadgets_pkey" PRIMARY KEY ("id")
);
