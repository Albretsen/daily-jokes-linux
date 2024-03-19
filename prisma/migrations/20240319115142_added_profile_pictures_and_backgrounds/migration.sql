-- CreateTable
CREATE TABLE "ProfilePicture" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "pictureId" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfilePicture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileBackground" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "backgroundId" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfileBackground_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProfilePicture_userId_idx" ON "ProfilePicture"("userId");

-- CreateIndex
CREATE INDEX "ProfileBackground_userId_idx" ON "ProfileBackground"("userId");

-- AddForeignKey
ALTER TABLE "ProfilePicture" ADD CONSTRAINT "ProfilePicture_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileBackground" ADD CONSTRAINT "ProfileBackground_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
