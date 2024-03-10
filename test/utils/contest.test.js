import { CheckContestOnDate, AddNewContestToDB } from "../../src/utils/contest.js";
import contest from "../../src/services/contest.js";
import { topics } from "../../assets/topics.js";

jest.mock("../../src/services/contest.js"); // Mock the contest service

describe("Contest utilities", () => {
    const date = "2024-02-15"; // Example date

    beforeEach(() => {
        jest.clearAllMocks(); // Clear mock history before each test
    });

    describe("CheckContestOnDate function", () => {
        test("should add a new contest to the database if not present", async () => {
            contest.findByCriteriaLegacy.mockResolvedValue([]); // Simulate no contest found for the given date

            await CheckContestOnDate(date);

            expect(contest.create).toHaveBeenCalledWith({
                date: new Date(date),
                topic: topics[new Date(date).getDate() % topics.length],
            });
        });

        test("should not add a new contest if already present", async () => {
            contest.findByCriteriaLegacy.mockResolvedValue([true]); // Simulate contest found for the given date

            await CheckContestOnDate(date);

            expect(contest.create).not.toHaveBeenCalled();
        });
    });

    describe("AddNewContestToDB function", () => {
        test("should correctly add a new contest with the right topic based on the date", async () => {
            const dayIndex = new Date(date).getDate() % topics.length;
            const expectedTopic = topics[dayIndex];

            await AddNewContestToDB(date);

            expect(contest.create).toHaveBeenCalledWith({
                date: new Date(date),
                topic: expectedTopic,
            });
        });
    });
});
