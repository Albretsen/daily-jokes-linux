import { ContestResult } from "../models/init.js";
import DatabaseError from "../models/error.js";
import JokeService from "./joke.js";
import ContestService from "./contest.js";

class ContestResultService {
  static async list() {
    try {
      return ContestResult.findMany();
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async get(id) {
    try {
      return await ContestResult.findUnique({ where: { id } });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async findByCriteria({ filters, exclude, pagination }) {
    const whereClause = buildWhereClause(filters, exclude);
    const paginationClause = calculatePagination(pagination);
    return await executeQuery(whereClause, paginationClause);
  }

  static async create(data) {
    try {
      return await ContestResult.create({ data });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async update(id, data) {
    try {
      return await ContestResult.update({
        where: { id },
        data,
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async delete(id) {
    try {
      await ContestResult.delete({ where: { id } });
      return true;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async createResultsForContest(contestId) {
    if (!contestId) {
      const yesterday = new Date(new Date() - 24 * 60 * 60 * 1000);
      const contest = await ContestService.getCurrentContest(yesterday);

      if (contest?.id === (await ContestService.getCurrentContest())?.id) return;

      if (contest?.id) contestId = contest.id;
      else return;

      if (contest?.resultsCalculated) return;
    }
    try {
      let page = 1;
      const userJokes = {};
      let jokesRetrieved;

      do {
        // Fetch jokes for the given contest with pagination
        const jokes = await JokeService.findByCriteria({
          filters: { contestId: contestId },
          sortBy: '-score',
          pagination: { page: page, page_size: MAX_PAGE_SIZE }
        });

        jokesRetrieved = jokes.length;
        page++;

        // Process jokes
        jokes.forEach(joke => {
          if (!userJokes[joke.userId] || userJokes[joke.userId].score < joke.score) {
            userJokes[joke.userId] = { jokeId: joke.id, score: joke.score };
          }
        });
      } while (jokesRetrieved === MAX_PAGE_SIZE);

      // Sort users by score of their highest-scoring joke in descending order
      const sortedUsers = Object.entries(userJokes)
        .sort((a, b) => b[1].score - a[1].score)
        .map(([userId, { jokeId, score }], index) => ({
          userId: parseInt(userId),
          jokeId,
          score,
          rank: index + 1 // Rank is index + 1 because array is zero-indexed
        }));

      // Create contest result for each user
      for (const { userId, jokeId, score, rank } of sortedUsers) {
        await ContestResult.create({
          data: {
            contestId,
            userId,
            jokeId,
            score,
            rank,
          }
        });
      }

      await ContestService.update(contestId, { resultsCalculated: true });

      return true;
    } catch (err) {
      if (err?.code === "P2002") await ContestService.update(contestId, { resultsCalculated: true });
      throw new DatabaseError(err);
    }
  }
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

const MAX_PAGE_SIZE = 10;
function calculatePagination(pagination = {}) {
  if (!pagination.page) pagination.page = 1;
  if (!pagination.page_size) pagination.page_size = MAX_PAGE_SIZE;
  if (pagination.page_size > MAX_PAGE_SIZE) pagination.page_size = MAX_PAGE_SIZE;

  const offset = (pagination.page - 1) * pagination.page_size;
  return { skip: offset, take: pagination.page_size };
}

async function executeQuery(whereClause, { skip, take }) {
  try {
    return await Notification.findMany({
      where: whereClause,
      skip,
      take,
    });
  } catch (err) {
    throw new DatabaseError(err);
  }
}

export default ContestResultService;
