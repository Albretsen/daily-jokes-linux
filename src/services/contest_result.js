import { ContestResult } from "../models/init.js";
import DatabaseError from "../models/error.js";
import JokeService from "./joke.js";
import ContestService from "./contest.js";
import CoinService from "./coin.js";
import NotificationService from "./notification.js";
import { formatTimestampToShortDate } from "../utils/date.js";

class ContestResultService {
  static async sendUserNotifications(sortedUsers, contest) {
    const messages = sortedUsers.map(userResult => {
      const contestDate = formatTimestampToShortDate(contest.date);
      const baseTitle = `${contestDate}`;
      let title;
      let body;

      switch (userResult.rank) {
        case 1:
          title = `${baseTitle}: Champion!`;
          body = `You won! Enjoy your 100 coins and the top spot humor glory.`;
          break;
        case 2:
          title = `${baseTitle}: 2nd Place!`;
          body = `Great job! 2nd place earns you 50 coins and loads of laughs.`;
          break;
        case 3:
          title = `${baseTitle}: 3rd Place!`;
          body = `Well done! 3rd place and 30 coins for your comedic prowess.`;
          break;
        default:
          title = `${baseTitle}: Results`;
          body = `Thanks for joining! ${userResult.coins > 0 ? `You've earned ${userResult.coins} coins.` : 'Keep sharing the laughter.'}`;
      }
      return {
        userId: userResult.userId,
        title,
        body,
      };
    });

    await NotificationService.sendNotifications(messages);
  }

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
      contestId = await this.getEligibleContestId();
      if (!contestId) return;
    }

    try {
      const userJokes = await this.fetchAndProcessJokes(contestId);
      const sortedUsers = this.calculateRanks(userJokes);
      const totalParticipants = sortedUsers.length;

      for (const userResult of sortedUsers) {
        const coins = this.calculateCoins(userResult.rank, totalParticipants);
        await ContestResult.create({
          data: {
            contestId,
            userId: userResult.userId,
            jokeId: userResult.jokeId,
            score: userResult.score,
            rank: userResult.rank,
            coins,
          }
        });

        await CoinService.addCoins(userResult.userId, coins);
      }

      await this.markResultsAsCalculated(contestId);
      const contest = await ContestService.get(contestId);
      await this.sendUserNotifications(sortedUsers, contest);
      return true;
    } catch (err) {
      if (err?.code === "P2002") await this.markResultsAsCalculated(contestId);
      throw new DatabaseError(err);
    }
  }

  /** 
   * Coin calculation is based on the following prices
   *  New Profile Picture: 50 coins
      New Background: 100 coins
      Boosting a Joke: 150 coins
      Superliking a Joke: 30 coins
      In-app purchase packs range from 100 coins for $0.99 to 1000 coins for $5.99.
   */

  static calculateCoins(rank, totalParticipants) {
    let coins = 0;
    const top50PercentLimit = Math.min(Math.ceil(totalParticipants / 2), totalParticipants);

    if (rank > top50PercentLimit) {
      return 0; // No reward for those outside the top 50%
    }

    // Assigning base rewards for top ranks and decreasing thereafter
    if (rank === 1) {
      coins = 100;
    } else if (rank === 2) {
      coins = 50;
    } else if (rank === 3) {
      coins = 30;
    } else if (rank === 4) {
      coins = 20;
    } else if (rank === 5) {
      coins = 15;
    } else {
      // For ranks below 5th, decrease gradually until the reward reaches about 10 coins
      // Calculate decrease factor based on the totalParticipants and the desired flattening point
      let decreaseFactor = (15 - 10) / (top50PercentLimit - 5);
      coins = Math.max(10, 15 - decreaseFactor * (rank - 5));
    }

    return Math.round(coins);
  }

  static async getEligibleContestId() {
    const yesterday = new Date(new Date() - 24 * 60 * 60 * 1000);
    const contest = await ContestService.getCurrentContest(yesterday);

    if (contest?.id && !contest?.resultsCalculated && contest?.id !== (await ContestService.getCurrentContest())?.id) {
      return contest.id;
    }
    return null;
  }

  static async fetchAndProcessJokes(contestId) {
    let page = 1;
    const userJokes = {};
    let jokesRetrieved;

    do {
      const jokes = await JokeService.findByCriteria({
        filters: { contestId: contestId },
        sortBy: '-score',
        pagination: { page: page, page_size: MAX_PAGE_SIZE }
      });

      jokesRetrieved = jokes.length;
      page++;

      jokes.forEach(joke => {
        if (!userJokes[joke.userId] || userJokes[joke.userId].score < joke.score) {
          userJokes[joke.userId] = { jokeId: joke.id, score: joke.score };
        }
      });
    } while (jokesRetrieved === MAX_PAGE_SIZE);

    return userJokes;
  }

  static calculateRanks(userJokes) {
    return Object.entries(userJokes)
      .sort((a, b) => b[1].score - a[1].score)
      .map(([userId, { jokeId, score }], index) => ({
        userId: parseInt(userId),
        jokeId,
        score,
        rank: index + 1
      }));
  }

  static async storeContestResults(contestId, sortedUsers) {
    for (const { userId, jokeId, score, rank, coins } of sortedUsers) {
      await ContestResult.create({
        data: {
          contestId,
          userId,
          jokeId,
          score,
          rank,
          coins
        }
      });
    }
  }

  static async markResultsAsCalculated(contestId) {
    await ContestService.update(contestId, { resultsCalculated: true });
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

const MAX_PAGE_SIZE = 25;
function calculatePagination(pagination = {}) {
  if (!pagination.page) pagination.page = 1;
  if (!pagination.page_size) pagination.page_size = MAX_PAGE_SIZE;
  if (pagination.page_size > MAX_PAGE_SIZE) pagination.page_size = MAX_PAGE_SIZE;

  const offset = (pagination.page - 1) * pagination.page_size;
  return { skip: offset, take: pagination.page_size };
}

async function executeQuery(whereClause, { skip, take }) {
  try {
    return await ContestResult.findMany({
      where: whereClause,
      include: { contest: true },
      skip,
      take,
    });
  } catch (err) {
    throw new DatabaseError(err);
  }
}

export default ContestResultService;
