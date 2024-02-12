import cron from 'node-cron';
import { VerifyFutureContests } from '../utils/contest.js'; 


export let ScheduleVerifyFutureContests = () => {
    VerifyFutureContests();

    cron.schedule('0 5 * * *', async () => {
        console.log('Running VerifyFutureContests at 5 AM');
        await VerifyFutureContests();
    }, {
        scheduled: true
    });
}
