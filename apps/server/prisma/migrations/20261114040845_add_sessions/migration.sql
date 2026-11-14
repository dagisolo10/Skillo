-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE
    "Session" (
        "id" TEXT NOT NULL,
        "status" "SessionStatus" NOT NULL DEFAULT 'PENDING',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "acceptedAt" TIMESTAMP(3),
        "skillId" TEXT NOT NULL,
        "mentorId" TEXT NOT NULL,
        "learnerId" TEXT NOT NULL,
        CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
    );

-- CreateIndex
CREATE INDEX "Session_skillId_idx" ON "Session" ("skillId");

-- CreateIndex
CREATE INDEX "Session_mentorId_idx" ON "Session" ("mentorId");

-- CreateIndex
CREATE INDEX "Session_learnerId_idx" ON "Session" ("learnerId");

-- CreateIndex
CREATE INDEX "Session_status_idx" ON "Session" ("status");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;