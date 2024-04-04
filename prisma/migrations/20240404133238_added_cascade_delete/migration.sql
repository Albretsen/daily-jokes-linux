-- DropForeignKey
ALTER TABLE "Coin" DROP CONSTRAINT "Coin_userId_fkey";

-- DropForeignKey
ALTER TABLE "ContestResult" DROP CONSTRAINT "ContestResult_contestId_fkey";

-- DropForeignKey
ALTER TABLE "ContestResult" DROP CONSTRAINT "ContestResult_jokeId_fkey";

-- DropForeignKey
ALTER TABLE "ContestResult" DROP CONSTRAINT "ContestResult_userId_fkey";

-- DropForeignKey
ALTER TABLE "Joke" DROP CONSTRAINT "Joke_contestId_fkey";

-- DropForeignKey
ALTER TABLE "Joke" DROP CONSTRAINT "Joke_userId_fkey";

-- DropForeignKey
ALTER TABLE "JokeSubmission" DROP CONSTRAINT "JokeSubmission_contestId_fkey";

-- DropForeignKey
ALTER TABLE "JokeSubmission" DROP CONSTRAINT "JokeSubmission_userId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropForeignKey
ALTER TABLE "ProfileBackground" DROP CONSTRAINT "ProfileBackground_userId_fkey";

-- DropForeignKey
ALTER TABLE "ProfilePicture" DROP CONSTRAINT "ProfilePicture_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserJokeLike" DROP CONSTRAINT "UserJokeLike_contestId_fkey";

-- DropForeignKey
ALTER TABLE "UserJokeLike" DROP CONSTRAINT "UserJokeLike_jokeId_fkey";

-- DropForeignKey
ALTER TABLE "UserJokeLike" DROP CONSTRAINT "UserJokeLike_userId_fkey";

-- AddForeignKey
ALTER TABLE "Joke" ADD CONSTRAINT "Joke_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Joke" ADD CONSTRAINT "Joke_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coin" ADD CONSTRAINT "Coin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JokeSubmission" ADD CONSTRAINT "JokeSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JokeSubmission" ADD CONSTRAINT "JokeSubmission_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserJokeLike" ADD CONSTRAINT "UserJokeLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserJokeLike" ADD CONSTRAINT "UserJokeLike_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserJokeLike" ADD CONSTRAINT "UserJokeLike_jokeId_fkey" FOREIGN KEY ("jokeId") REFERENCES "Joke"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestResult" ADD CONSTRAINT "ContestResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestResult" ADD CONSTRAINT "ContestResult_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestResult" ADD CONSTRAINT "ContestResult_jokeId_fkey" FOREIGN KEY ("jokeId") REFERENCES "Joke"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfilePicture" ADD CONSTRAINT "ProfilePicture_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileBackground" ADD CONSTRAINT "ProfileBackground_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
