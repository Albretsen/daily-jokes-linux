import fs from 'fs';
import JokeDatasetService from '../services/joke_dataset.js';

export const readJsonFile = (filePath, callback) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("An error occurred while reading the file:", err);
            return;
        }
        try {
            const jsonData = JSON.parse(data);
            callback(jsonData);
        } catch (parseErr) {
            console.error("Error parsing JSON:", parseErr);
        }
    });
};

export const JSONFileToTable = () => {
    console.log("Converting JSON to table...");
    readJsonFile("./dataset/wocka.json", async (result) => {
        let i = 0;
        while (typeof result[i] == 'object') {

            try {

                console.log("Posting joke: " + result[i].id);
                await JokeDatasetService.create({
                    body: result[i].body,
                    category: result[i].category,
                    title: result[i].title
                });
                console.log("Finished posting joke: " + result[i].id);

            } catch (err) {
                console.log("Error posting joke: " + result[i].id + " | " + err);
            }

            if (i > 100000) {
                i = 9999999;
            }
            i++;
        }
    })
}

