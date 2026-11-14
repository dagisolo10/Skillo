-- CreateTable
CREATE TABLE
    "User" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "username" TEXT NOT NULL,
        "bio" TEXT,
        "email" TEXT NOT NULL,
        "avatarSeed" TEXT NOT NULL DEFAULT 'Felix',
        "credits" INTEGER NOT NULL DEFAULT 2,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
    );

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User" ("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User" ("email");