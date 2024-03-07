import { ScheduleVerifyFutureContests } from "./verify_future_contests.js";
import { ScheduleExecuteBots } from "./execute_bots.js";
import { ScheduleCreateContestResults } from "./calculate_contest_results.js";

let VerifyFutureContestsSchedule;
let ExecuteBots;
let CreateContestResults;

export let schedule = () => {
    VerifyFutureContestsSchedule = ScheduleVerifyFutureContests();
    ExecuteBots = ScheduleExecuteBots();
    CreateContestResults = ScheduleCreateContestResults();
}

export let unschedule = () => {
    VerifyFutureContestsSchedule.stop();
    ExecuteBots.stop();
    CreateContestResults.stop();
}