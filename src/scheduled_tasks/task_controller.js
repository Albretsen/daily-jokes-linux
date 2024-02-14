import { ScheduleVerifyFutureContests } from "./verify_future_contests.js";

let VerifyFutureContestsSchedule;

export let schedule = () => {
    VerifyFutureContestsSchedule = ScheduleVerifyFutureContests();
}

export let unschedule = () => {
    VerifyFutureContestsSchedule.stop();
}