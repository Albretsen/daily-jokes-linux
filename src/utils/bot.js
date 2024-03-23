import axios from 'axios';
import ContestService from "../services/contest.js"
import JokeDatasetService from "../services/joke_dataset.js";

let TOKENS = ["646vcMdcjQSYnEM87Qp.Ig8Nd047H1QX4PJqOBBWM.cWAXJCg.8gQwWWLxAOtSd9",
    "Dtyc5ajo2CdppqLQyY.VVTLzz6nIdd52tB.YU3HNTdXf5NrDQ7eYegrezFMy0LT8",
    "uTE6iChChnNagt9bqnoJMQpl87Rny3oehWIL9CtNp7CpNQ7l8mUMbGWu.GwPx5t0",
    "0XSadAIszhhCeDbPXifsoIJS3Om59aivj4kD6EDWq3Qq2TI18XO9PRpwz0prnqtD",
    "jZWkZdTLW5zuPGn1CY7zF6DDluCSHXCe.WMGJ7u.N7jfdUEr2IsYciZXglzMJ28Q",
    "QRaJ3oP.3okgWsu8LT4UGS.yn8kGe9u42psfXYcuqy8a719C8GevdkdM4kNH9Twb"]

export const ExecuteBots = async () => {
    const contest = await ContestService.getCurrentContest();
    if (contest.bots) return;
    await ContestService.update(contest.id, { bots: true });
    const jokes = await JokeDatasetService.findByCriteria({ category: contest.topic });

    if (jokes.length > 0) {
        const numberOfBots = Math.floor(Math.random() * (TOKENS.length - 4 + 1)) + 4;
        const randomizedTokens = TOKENS.sort(() => 0.5 - Math.random()).slice(0, numberOfBots);
        for (const token of randomizedTokens) {
            const numberOfJokesToPost = Math.random() > 0.5 ? 1 : 2;
            const jokesToPost = jokes.sort(() => 0.5 - Math.random()).slice(0, numberOfJokesToPost);
            for (const joke of jokesToPost) {
                await postJoke(joke, token);
            }
        }
    } else {
        console.log("No jokes found for the contest topic.");
    }
};

const postJoke = async (joke, token) => {
    try {
        const response = await axios.post('http://localhost:3000/api/v1/joke', {
            textBody: joke.body
        }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log(`Joke posted successfully: ${response.data}`);
    } catch (error) {
        console.error(`Error posting joke: ${error}`);
    }
};
