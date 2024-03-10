import ContestService from "../services/contest.js";

export const GenerateJokeJSON = async (userID, textBody) => {
    let contest = await ContestService.findByCriteriaLegacy({ date: new Date() });

    if (!contest[0].id) {
        throw new Error("No corresponding contest could be found");
    }

    return {
        textBody: textBody,
        userId: userID,
        createTimeStamp: new Date(),
        contestId: contest[0].id,
        score: 0,
    }
}