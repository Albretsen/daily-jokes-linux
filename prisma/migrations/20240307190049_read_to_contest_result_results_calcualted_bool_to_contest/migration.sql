-- AlterTable
ALTER TABLE "Contest" ADD COLUMN     "resultsCalculated" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ContestResult" ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false;
