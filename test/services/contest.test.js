import ContestService from '../../src/services/contest.js';
import { Contest } from '../../src/models/init';

describe("ContestService", () => {
    const mockContests = [
        { id: 1, date: '2024-02-03', text: 'Contest A' },
        { id: 2, date: '2024-02-04', text: 'Contest B' },
    ];

    beforeAll(() => {
        Contest.findMany = jest.fn();
        Contest.findUnique = jest.fn();
        Contest.create = jest.fn();
        Contest.update = jest.fn();
        Contest.delete = jest.fn();
    });

    describe("findByCriteria", () => {
        test("finds contests by date (YYYY-MM-DD format)", async () => {
            Contest.findMany.mockResolvedValue([mockContests[0]]);
            const criteria = { date: '2024-02-03' }; // Date in 'YYYY-MM-DD' format

            const result = await ContestService.findByCriteria(criteria);
            
            expect(Contest.findMany).toHaveBeenCalledWith({ where: { date: '2024-02-03' } });
            expect(result).toEqual([mockContests[0]]);
        });

        test("handles different date formats", async () => {
            Contest.findMany.mockResolvedValue([mockContests[0]]);
            const criteria = { date: new Date('2024-02-03').toISOString().split('T')[0] }; // Convert to 'YYYY-MM-DD' format

            const result = await ContestService.findByCriteria(criteria);
            
            expect(Contest.findMany).toHaveBeenCalledWith({ where: { date: '2024-02-03' } });
            expect(result).toEqual([mockContests[0]]);
        });

    });

});
