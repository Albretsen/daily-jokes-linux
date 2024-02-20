import { Coin } from "../models/init.js";
import DatabaseError from "../models/error.js";

class CoinService {
  static async list() {
    try {
      return Coin.findMany();
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async get(userId) {
    try {
      return await Coin.findUnique({ where: { userId } });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async create(data) {
    try {
      return await Coin.create({ data });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async update(id, data) {
    try {
      return await Coin.update({
        where: { id },
        data,
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async delete(id) {
    try {
      await Coin.delete({ where: { id } });
      return true;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
}

export default CoinService;