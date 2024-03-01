import { ScheduleVerifyFutureContests } from "./verify_future_contests.js";
//import { ScheduleExecuteBots } from "./execute_bots.js";

let VerifyFutureContestsSchedule;
//let ExecuteBots;

export let schedule = () => {
    VerifyFutureContestsSchedule = ScheduleVerifyFutureContests();
    //ExecuteBots = ScheduleExecuteBots();
}

export let unschedule = () => {
    VerifyFutureContestsSchedule.stop();
    //ExecuteBots.stop();
}