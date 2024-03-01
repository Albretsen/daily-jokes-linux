import fs from 'fs';
import path from 'path'; // Import the path module
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
    // Use path.resolve to ensure the file path is correctly formed based on the current file's location
    const filePath = path.resolve(__dirname, './dataset/wocka.json');
    readJsonFile(filePath, async (result) => {
        let i = 0;
        while (typeof result[i] == 'object') {
            try {
                await JokeDatasetService.create({
                    body: result[i].body,
                    category: result[i].category,
                    title: result[i].title
                });
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