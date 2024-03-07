import cron from 'node-cron';
import { VerifyFutureContests } from '../utils/contest.js'; 


export let ScheduleVerifyFutureContests = () => {
    VerifyFutureContests();

    return cron.schedule('0 0 * * *', async () => {
        await VerifyFutureContests();
    }, {
        scheduled: true
    });
}
