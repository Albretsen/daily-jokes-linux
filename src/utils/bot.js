import axios from 'axios';
import ContestService from "../services/contest.js"
import JokeDatasetService from "../services/joke_dataset.js";

let TOKENS = ["zdrCqhzf1j8Eg36ShhX79j7ta.YBCv848SElDO9A8GpO7aAGiexeVhSFgrKJw5ls",
    "QRaJ3oP.3okgWsu8LT4UGS.yn8kGe9u42psfXYcuqy8a719C8GevdkdM4kNH9Twb",
    "jZWkZdTLW5zuPGn1CY7zF6DDluCSHXCe.WMGJ7u.N7jfdUEr2IsYciZXglzMJ28Q"]

export const ExecuteBots = async () => {
    const contest = await ContestService.getCurrentContest();
    const jokes = await JokeDatasetService.findByCriteria({ category: contest.topic });

    if (jokes.length > 0) {
        TOKENS.forEach(async (token) => {
            const jokesToPost = jokes.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 2);
            //jokesToPost.forEach(joke => postJoke(joke, token));
        });
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
