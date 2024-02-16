/*
  Warnings:

  - Made the column `topic` on table `Contest` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `contestId` to the `Joke` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contest" ALTER COLUMN "topic" SET NOT NULL;

-- AlterTable
ALTER TABLE "Joke" ADD COLUMN     "contestId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profile" VARCHAR(255),
ALTER COLUMN "deviceID" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Joke_userId_idx" ON "Joke"("userId");

-- CreateIndex
CREATE INDEX "Joke_contestId_idx" ON "Joke"("contestId");

-- AddForeignKey
ALTER TABLE "Joke" ADD CONSTRAINT "Joke_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Joke" ADD CONSTRAINT "Joke_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
