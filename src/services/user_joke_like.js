import { UserJokeLike } from "../models/init.js";
import DatabaseError from "../models/error.js";

class UserJokeLikeService {
    static async verifyJokeNotAlreadyLiked(jokeId, userId) {
        try {
            const like = await UserJokeLike.findFirst({
                where: {
                    jokeId: jokeId,
                    userId: userId,
                },
            });
            return like !== null;
        } catch (err) {
            return false;
        }
    }

    static async findJokeIdsByContest(contestId) {
        try {
            const likes = await UserJokeLike.findMany({
                where: {
                    contestId: contestId,
                },
                select: {
                    jokeId: true, 
                },
            });
            const jokeIds = likes.map(like => like.jokeId);
            return jokeIds;
        } catch (err) {
            throw new DatabaseError(err);
        }
    }

    static async list() {
        try {
            return UserJokeLike.findMany();
        } catch (err) {
            throw new DatabaseError(err);
        }
    }

    static async get(id) {
        try {
            return await UserJokeLike.findUnique({ where: { id } });
        } catch (err) {
            throw new DatabaseError(err);
        }
    }

    static async create(data) {
        try {
            return await UserJokeLike.create({ data });
        } catch (err) {
            throw new DatabaseError(err);
        }
    }

    static async update(id, data) {
        try {
            return await UserJokeLike.update({
                where: { id },
                data,
            });
        } catch (err) {
            throw new DatabaseError(err);
        }
    }

    static async delete(id) {
        try {
            await UserJokeLike.delete({ where: { id } });
            return true;
        } catch (err) {
            throw new DatabaseError(err);
        }
    }
}

export default UserJokeLikeService;