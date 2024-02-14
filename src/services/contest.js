import { Contest } from "../models/init.js";
import DatabaseError from "../models/error.js";
import { formatDate } from "../utils/date.js";

class ContestService {
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
