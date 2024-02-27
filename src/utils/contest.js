import contest from "../services/contest.js";
import { topics } from "../../assets/topics.js";

const DAYS_AHEAD = 10;

export const CheckContestOnDate = async (date) => {
    const result = await contest.findByCriteria({ date: new Date(date) });
    if (!result[0]) await AddNewContestToDB(date); 
}

export const AddNewContestToDB = async (date) => {
    await contest.create({
        date: new Date(date),
        topic: topics[new Date(date).getDate() % topics.length],
    })
}

export const VerifyFutureContests = async () => {
    for (let i = 0; i < DAYS_AHEAD; i++) {
        let currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + i);
        let formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
        await CheckContestOnDate(formattedDate);
    }
}