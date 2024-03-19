import { ProfileBackground } from "../models/init.js";
import DatabaseError from "../models/error.js";

class ProfileBackgroundService {
    static async list() {
        try {
            return ProfileBackground.findMany();
        } catch (err) {
            throw new DatabaseError(err);
        }
    }

    static async get(id) {
        try {
            return await ProfileBackground.findUnique({ where: { id } });
        } catch (err) {
            throw new DatabaseError(err);
        }
    }

    static async getByUserId(userId) {
        try {
            return await ProfileBackground.findMany({
                where: { userId },
            });
        } catch (err) {
            throw new DatabaseError(err);
        }
    }

    static async create(data) {
        try {
            return await ProfileBackground.create({ data });
        } catch (err) {
            throw new DatabaseError(err);
        }
    }

    static async update(id, data) {
        try {
            return await ProfileBackground.update({
                where: { id },
                data,
            });
        } catch (err) {
            throw new DatabaseError(err);
        }
    }

    static async delete(id) {
        try {
            await ProfileBackground.delete({ where: { id } });
            return true;
        } catch (err) {
            throw new DatabaseError(err);
        }
    }
}

export default ProfileBackgroundService;