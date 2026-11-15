-- AlterTable
ALTER TABLE "Skill"
ADD COLUMN "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Skill_deletedAt_idx" ON "Skill" ("deletedAt");