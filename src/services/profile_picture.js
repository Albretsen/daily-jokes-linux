import { ProfilePicture } from "../models/init.js";
import DatabaseError from "../models/error.js";

class ProfilePictureService {
    static async list() {
        try {
            return ProfilePicture.findMany();
        } catch (err) {
            throw new DatabaseError(err);
        }
    }

    static async get(id) {
        try {
            return await ProfilePicture.findUnique({ where: { id } });
        } catch (err) {
            throw new DatabaseError(err);
        }
    }

    static async getByUserId(userId) {
        try {
            return await ProfilePicture.findMany({
                where: { userId },
            });
        } catch (err) {
            throw new DatabaseError(err);
        }
    }

    static async create(data) {
        try {
            return await ProfilePicture.create({ data });
        } catch (err) {
            throw new DatabaseError(err);
        }
    }

    static async update(id, data) {
        try {
            return await ProfilePicture.update({
                where: { id },
                data,
            });
        } catch (err) {
            throw new DatabaseError(err);
        }
    }

    static async delete(id) {
        try {
            await ProfilePicture.delete({ where: { id } });
            return true;
        } catch (err) {
            throw new DatabaseError(err);
        }
    }
}

export default ProfilePictureService;