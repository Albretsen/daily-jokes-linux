import { ContestResult } from "../models/init.js";
import DatabaseError from "../models/error.js";
import { formatDate } from "../utils/date.js";

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

  static async findByCriteria(criteria) {
    try {
      let whereClause = {};
      if (criteria.date) {
        whereClause.date = new Date(formatDate(criteria.date));
      }
      if (criteria.text) {
        whereClause.text = criteria.text;
      }

      return await ContestResult.findMany({
        where: whereClause,
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
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
}

export default ContestResultService;
