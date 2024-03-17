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
    const contest = await ContestService.findByCriteriaLegacy({ date: contestDate });
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

  static async findByCriteria({ filters, sortBy, exclude, pagination }) {
    const whereClause = buildWhereClause(filters, exclude);
    const orderByClause = buildOrderByClause(sortBy);
    const paginationClause = calculatePagination(pagination);
    return await executeQuery(whereClause, orderByClause, paginationClause);
  }

  static async findByCriteriaLegacy(criteria) {
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

const MAX_PAGE_SIZE = 25;
function calculatePagination(pagination = {}) {
  if (!pagination.page) pagination.page = 1;
  if (!pagination.page_size) pagination.page_size = MAX_PAGE_SIZE;
  if (pagination.page_size > MAX_PAGE_SIZE) pagination.page_size = MAX_PAGE_SIZE;

  const offset = (pagination.page - 1) * pagination.page_size;
  return { skip: offset, take: pagination.page_size };
}

function buildWhereClause(filters, exclude) {
  const whereClause = {};

  if (filters) {
    Object.keys(filters).forEach(key => {
      whereClause[key] = filters[key];
    });
  }

  if (exclude) {
    Object.keys(exclude).forEach(key => {
      if (exclude[key].notIn) {
        whereClause[key] = { notIn: exclude[key].notIn };
      } else if (exclude[key].not !== undefined) {
        whereClause[key] = { not: exclude[key].not };
      }
    });
  }

  return whereClause;
}

function buildOrderByClause(sortBy) {
  const orderByClause = [];
  if (sortBy) {
    const [field, order] = sortBy.startsWith('-') ? [sortBy.slice(1), 'desc'] : [sortBy, 'asc'];
    orderByClause.push({ [field]: order });
  }
  return orderByClause;
}

async function executeQuery(whereClause, orderByClause, { skip, take }) {
  try {
    return await Contest.findMany({
      where: whereClause,
      orderBy: orderByClause,
      skip,
      take,
    });
  } catch (err) {
    throw new DatabaseError(err);
  }
}
