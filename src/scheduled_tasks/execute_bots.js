import cron from 'node-cron';
import { ExecuteBots } from '../utils/bot.js'; 
import NotificationService from '../services/notification.js';

export let ScheduleExecuteBots = () => {
    try {
        //NotificationService.sendExpoNotifications(["ExponentPushToken[k3tFThGDt9sjRasvB1z4V4]"], { title: "Tile", body: "Message", data: {}})
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
