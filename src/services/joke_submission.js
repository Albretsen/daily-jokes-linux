import { JokeSubmission } from "../models/init.js";
import DatabaseError from "../models/error.js";
import ContestService from "./contest.js";
import CoinService from "./coin.js";
class JokeSubmissionService {
    static async purchaseAdditionalSlot(userId) {
        try {
            const contestDetails = await ContestService.getCurrentContest();
            await CoinService.purchase(userId, 10); 

            const submission = await JokeSubmissionService.get(userId, contestDetails.id);
            if (!submission) {
                throw new Error('Submission not found');
            }

            const updatedSubmission = await JokeSubmissionService.update(submission.id, { additionalSlotsPurchased: submission.additionalSlotsPurchased + 1 });

            return updatedSubmission;
        } catch (err) {
            return { error: err.message };
        }
    }

    static async submitJoke(userId) {
        try {
            const contestDetails = await ContestService.getCurrentContest();
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

    static async getOrCreateSubmission(userId, contestId) {
        let submission;
        try {
            submission = await this.get(userId, contestId);
        } catch(err) {
            submission = undefined;
        }
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
