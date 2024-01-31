import Prisma from "@prisma/client";

// PrismaClient is not available when testing
const { PrismaClient } = Prisma || {};
const prisma = PrismaClient ? new PrismaClient() : {};

export const User = prisma.user;
export const Contest = prisma.contest;
export const Joke = prisma.joke;
export const JokeDataset = prisma.jokeDataset;

console.log("HERE: " + Object.keys(prisma))
