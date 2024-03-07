import cron from 'node-cron';
import ContestResultService from '../services/contest_result.js';

export let ScheduleCreateContestResults = () => {
    try {
        ContestResultService.createResultsForContest();
    } catch (err) {
        console.log("Error calculating contest results: " + err);
    }

    return cron.schedule('0 5 * * *', async () => {
        try {
            await ContestResultService.createResultsForContest();
        } catch (err) {
            console.log("Error calculating contest results: " + err);
        }
    }, {
        scheduled: true
    });
}
