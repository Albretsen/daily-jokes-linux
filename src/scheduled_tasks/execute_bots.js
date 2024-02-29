import cron from 'node-cron';
import { ExecuteBots } from '../utils/bot.js'; 


export let ScheduleExecuteBots = () => {
    ExecuteBots();

    return cron.schedule('0 5 * * *', async () => {
        await ExecuteBots();
    }, {
        scheduled: true
    });
}
