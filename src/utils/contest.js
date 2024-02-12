import contest from "../services/contest.js";
import { topics } from "../../assets/topics.js";

const DAYS_AHEAD = 3;

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
        let formattedDate = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate() + i).padStart(2, '0')}`;
        await CheckContestOnDate(formattedDate);
    }
}