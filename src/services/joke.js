import { Joke } from "../models/init.js";
import DatabaseError from "../models/error.js";

class JokeService {
  static async list() {
    try {
      return Joke.findMany();
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async get(id) {
    try {
      return await Joke.findUnique({ where: { id } });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async create(data) {
    try {
      return await Joke.create({ data });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async update(id, data) {
    try {
      return await Joke.update({
        where: { id },
        data,
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async delete(id) {
    try {
      await Joke.delete({ where: { id } });
      return true;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async findByCriteria({ userId, contestId, sortBy }) {
    try {
      const whereClause = {};

      if (userId) whereClause.userId = userId;

      if (contestId) whereClause.contestId = contestId;

      const orderByClause = [];
      if (sortBy) {
        const [field, order] = sortBy.startsWith('-') ? [sortBy.slice(1), 'desc'] : [sortBy, 'asc'];
        orderByClause.push({ [field]: order });
      }

      return await Joke.findMany({
        where: whereClause,
        orderBy: orderByClause,
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
}

export default JokeService;
