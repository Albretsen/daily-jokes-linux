-- CreateTable
CREATE TABLE "JokeDataset" (
    "id" SERIAL NOT NULL,
    "body" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "JokeDataset_pkey" PRIMARY KEY ("id")
);
