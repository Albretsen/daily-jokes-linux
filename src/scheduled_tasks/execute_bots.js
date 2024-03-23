import cron from 'node-cron';
import { ExecuteBots } from '../utils/bot.js'; 

export let ScheduleExecuteBots = () => {
    try {
        ExecuteBots();
    } catch (err) {
        console.log("Error executing bots: " + err);
    }

    return cron.schedule('0 5 * * *', async () => {
        try {
            await ExecuteBots();
        } catch (err) {
            console.log("Error executing bots: " + err);
        }
    }, {
        scheduled: true
    });
}
