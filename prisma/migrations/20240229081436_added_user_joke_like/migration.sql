-- CreateTable
CREATE TABLE "UserJokeLike" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "jokeId" INTEGER NOT NULL,
    "contestId" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "likedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserJokeLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserJokeLike_userId_jokeId_contestId_key" ON "UserJokeLike"("userId", "jokeId", "contestId");

-- AddForeignKey
ALTER TABLE "UserJokeLike" ADD CONSTRAINT "UserJokeLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserJokeLike" ADD CONSTRAINT "UserJokeLike_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserJokeLike" ADD CONSTRAINT "UserJokeLike_jokeId_fkey" FOREIGN KEY ("jokeId") REFERENCES "Joke"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
