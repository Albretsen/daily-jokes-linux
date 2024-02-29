import { JokeDataset } from "../models/init.js";
import DatabaseError from "../models/error.js";

class JokeDatasetService {
    static async list() {
        try {
            return JokeDataset.findMany();
        } catch (err) {
            throw new DatabaseError(err);
        }
    }

    static async findByCriteria(criteria) {
        try {
            let whereClause = {};
            if (criteria.category) {
                // Using contains for case-insensitive matching
                whereClause.category = {
                    contains: criteria.category,
                    mode: 'insensitive', // Makes the comparison case-insensitive
                };
            }

            return await JokeDataset.findMany({
                where: whereClause,
            });
        } catch (err) {
            throw new DatabaseError(err);
        }
    }

    static async get(category) {
        try {
            return await JokeDataset.findUnique({ where: { category } });
        } catch (err) {
            throw new DatabaseError(err);
        }
    }

    static async create(data) {
        try {
            return await JokeDataset.create({ data });
        } catch (err) {
            throw new DatabaseError(err);
        }
    }

    static async update(id, data) {
        try {
            return await JokeDataset.update({
                where: { id },
                data,
            });
        } catch (err) {
            throw new DatabaseError(err);
        }
    }

    static async delete(id) {
        try {
            await JokeDataset.delete({ where: { id } });
            return true;
        } catch (err) {
            throw new DatabaseError(err);
        }
    }
}

export default JokeDatasetService;
