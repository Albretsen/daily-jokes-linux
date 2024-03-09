import Prisma from "@prisma/client";

// PrismaClient is not available when testing
const { PrismaClient } = Prisma || {};
export const prisma = PrismaClient ? new PrismaClient() : {};

export const User = prisma.user;
export const Contest = prisma.contest;
export const Joke = prisma.joke;
export const JokeDataset = prisma.jokeDataset;
export const Coin = prisma.Coin;
export const JokeSubmission = prisma.JokeSubmission;
export const UserJokeLike = prisma.UserJokeLike;
export const ContestResult = prisma.ContestResult;
export const Notification = prisma.Notification;