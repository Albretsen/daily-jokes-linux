import { Contest } from "../models/init.js";
import DatabaseError from "../models/error.js";
import { formatDate } from "../utils/date.js";
import JokeService from "./joke.js";
import UserService from "./user.js";
import { prisma } from "../models/init.js";

import { getCurrentContestDate } from "../utils/date.js";

class ContestService {
  static async getContestParticipants(contestId) {
    const uniqueUserIds = new Set();
    let currentPage = 1;
    const pageSize = 10; // Adjust if necessary for efficiency
    let hasMoreJokes = true;

    try {
      while (uniqueUserIds.size < 10 && hasMoreJokes) {
        const jokes = await JokeService.findByCriteria({
          filters: { contestId: contestId },
          pagination: { page: currentPage, page_size: pageSize }
        });

        jokes.forEach(joke => {
          if (uniqueUserIds.size < 10) {
            uniqueUserIds.add(joke.userId);
          }
        });

        currentPage++;
        hasMoreJokes = jokes.length === pageSize;
      }

      const userInfosPromises = Array.from(uniqueUserIds).map(userId => UserService.getPublicUserInfo(userId));
      const userInfos = await Promise.all(userInfosPromises);

      return userInfos;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async countDistinctContestParticipants(contestId) {
    try {
      const result = await prisma.$queryRaw`SELECT COUNT(DISTINCT "userId") FROM "Joke" WHERE "contestId" = ${contestId}`;
      const count = result[0].count;

      return count;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async getCurrentContest(date) {
    const contestDate = date ? date : getCurrentContestDate();
    const contest = await ContestService.findByCriteria({ date: contestDate });
    if (!contest || contest.length === 0) throw new Error("Contest not found");
    return contest[0];
  }

  static async list() {
    try {
      return Contest.findMany();
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async get(id) {
    try {
      return await Contest.findUnique({ where: { id } });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async findByCriteria(criteria) {
    try {
      let whereClause = {};
      if (criteria.date) {
        whereClause.date = new Date(formatDate(criteria.date));
      }
      if (criteria.text) {
        whereClause.text = criteria.text;
      }

      return await Contest.findMany({
        where: whereClause,
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async create(data) {
    try {
      return await Contest.create({ data });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async update(id, data) {
    try {
      return await Contest.update({
        where: { id },
        data,
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async delete(id) {
    try {
      await Contest.delete({ where: { id } });
      return true;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
}

export default ContestService;
