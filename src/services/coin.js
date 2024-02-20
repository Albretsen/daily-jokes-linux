import { Coin } from "../models/init.js";
import DatabaseError from "../models/error.js";

class CoinService {
    static async purchase(userId, amountToDecrement) {
        try {
            const coin = await CoinService.get(userId);
            if (!coin) {
                throw new Error('Coin not found');
            }
            if (coin.coins < amountToDecrement) {
                throw new Error('Insufficient coin amount');
            }

            const newAmount = coin.coins - amountToDecrement;

            return await CoinService.update(userId, { coins: newAmount });
        } catch (err) {
            throw new DatabaseError(err);
        }
    }

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

    static async update(userId, data) {
        try {
            return await Coin.update({
                where: { userId },
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
