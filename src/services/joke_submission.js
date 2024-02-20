import { JokeSubmission } from "../models/init.js";
import DatabaseError from "../models/error.js";
import ContestService from "./contest.js";
import { getCurrentContestDate } from "../utils/date.js";

class JokeSubmissionService {
    static async verify(userId) {
        let jokeSubmission = await JokeSubmissionService.getOrCreateForCurrentContest(userId);

        return jokeSubmission.jokesSubmitted - (3 + jokeSubmission.additionalSlotsPurchased) < 0;
    }

    static async getOrCreateForCurrentContest(userId) {
        let contest = await ContestService.findByCriteria({ date: getCurrentContestDate() });
        let jokeSubmission = await JokeSubmissionService.get(userId, contest[0].id);

        if (!jokeSubmission) {
            let result = await JokeSubmissionService.create({
                userId: userId,
                contestId: contest[0].id,
            });
            return result;
        }

        return jokeSubmission;
    }
    
    static async incrementJokesSubmitted(userId) {
        let contest = await ContestService.findByCriteria({ date: getCurrentContestDate() });
        let jokeSubmission = await JokeSubmissionService.get(userId, contest[0].id);

        await JokeSubmissionService.update(jokeSubmission.id, { jokesSubmitted: jokeSubmission.jokesSubmitted + 1 });
    }

    static async list() {
        try {
            return JokeSubmission.findMany();
        } catch (err) {
            throw new DatabaseError(err);
        }
    }

    static async get(userId, contestId) {
        try {
            return await JokeSubmission.findUnique({
                where: {
                    userId_contestId: { userId, contestId },
                },
            });
        } catch (err) {
            throw new DatabaseError(err);
        }
    }

    static async create(data) {
        try {
            return await JokeSubmission.create({ data });
        } catch (err) {
            throw new DatabaseError(err);
        }
    }

    static async update(id, data) {
        try {
            return await JokeSubmission.update({
                where: { id },
                data,
            });
        } catch (err) {
            throw new DatabaseError(err);
        }
    }

    static async delete(id) {
        try {
            await JokeSubmission.delete({ where: { id } });
            return true;
        } catch (err) {
            throw new DatabaseError(err);
        }
    }
}

export default JokeSubmissionService;
