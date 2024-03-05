-- CreateTable
CREATE TABLE "ContestResult" (
    "id" SERIAL NOT NULL,
    "contestId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "jokeId" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "rank" INTEGER,

    CONSTRAINT "ContestResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContestResult_contestId_idx" ON "ContestResult"("contestId");

-- CreateIndex
CREATE INDEX "ContestResult_userId_idx" ON "ContestResult"("userId");

-- CreateIndex
CREATE INDEX "ContestResult_jokeId_idx" ON "ContestResult"("jokeId");

-- CreateIndex
CREATE UNIQUE INDEX "ContestResult_contestId_userId_key" ON "ContestResult"("contestId", "userId");

-- AddForeignKey
ALTER TABLE "ContestResult" ADD CONSTRAINT "ContestResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestResult" ADD CONSTRAINT "ContestResult_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestResult" ADD CONSTRAINT "ContestResult_jokeId_fkey" FOREIGN KEY ("jokeId") REFERENCES "Joke"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
