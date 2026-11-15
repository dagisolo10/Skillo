-- CreateIndex
CREATE UNIQUE INDEX "Session_learnerId_skillId_key" ON "Session"("learnerId", "skillId") WHERE (status IN ('PENDING', 'ACTIVE'));

