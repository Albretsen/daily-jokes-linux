-- CreateTable
CREATE TABLE "UserCoins" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "coins" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserCoins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JokeSubmission" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "contestId" INTEGER NOT NULL,
    "jokesSubmitted" INTEGER NOT NULL DEFAULT 0,
    "additionalSlotsPurchased" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "JokeSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserCoins_userId_key" ON "UserCoins"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "JokeSubmission_userId_contestId_key" ON "JokeSubmission"("userId", "contestId");

-- AddForeignKey
ALTER TABLE "UserCoins" ADD CONSTRAINT "UserCoins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JokeSubmission" ADD CONSTRAINT "JokeSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JokeSubmission" ADD CONSTRAINT "JokeSubmission_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
