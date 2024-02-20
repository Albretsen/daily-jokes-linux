import { JokeSubmission } from "../models/init.js";
import DatabaseError from "../models/error.js";
import ContestService from "./contest.js";
import { getCurrentContestDate } from "../utils/date.js";

class JokeSubmissionService {
    static async submitJoke(userId) {
        try {
            const contestDetails = await this.getCurrentContest();
            const submissionDetails = await this.getOrCreateSubmission(userId, contestDetails.id);
            const updateResult = await this.updateSubmissionIfAllowed(submissionDetails);

            return {
                canSubmit: updateResult.canSubmit,
                message: updateResult.message,
                remainingSubmissions: updateResult.remainingSubmissions
            };
        } catch (err) {
            throw new DatabaseError(err.message);
        }
    }

    static async getCurrentContest() {
        const contestDate = getCurrentContestDate();
        const contest = await ContestService.findByCriteria({ date: contestDate });
        if (!contest || contest.length === 0) throw new Error("Contest not found");
        return contest[0];
    }

    static async getOrCreateSubmission(userId, contestId) {
        let submission = await this.get(userId, contestId);
        if (!submission) {
            submission = await this.create({
                userId,
                contestId,
            });
        }

        return submission;
    }

    static async updateSubmissionIfAllowed(submission) {
        const maxSubmissions = 3 + submission.additionalSlotsPurchased;
        const remainingSubmissions = maxSubmissions - submission.jokesSubmitted;

        if (remainingSubmissions <= 0) {
            return {
                canSubmit: false,
                message: "Submission limit reached.",
                remainingSubmissions: 0,
            };
        }

        await this.update(submission.id, { jokesSubmitted: submission.jokesSubmitted + 1 });

        return {
            canSubmit: true,
            remainingSubmissions: remainingSubmissions - 1,
        };
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
