import { Notification } from "../models/init.js";
import DatabaseError from "../models/error.js";

class NotificationService {
    static async list() {
        try {
            return Notification.findMany();
        } catch (err) {
            throw new DatabaseError(err);
        }
    }

    static async get(id) {
        try {
            return await Notification.findUnique({ where: { id } });
        } catch (err) {
            throw new DatabaseError(err);
        }
    }

    static async create(data) {
        try {
            return await Notification.create({ data });
        } catch (err) {
            throw new DatabaseError(err);
        }
    }

    static async update(userId, data) {
        try {
            return await Notification.update({
                where: { userId },
                data,
            });
        } catch (err) {
            throw new DatabaseError(err);
        }
    }

    static async delete(id) {
        try {
            await Notification.delete({ where: { id } });
            return true;
        } catch (err) {
            throw new DatabaseError(err);
        }
    }
}

export default NotificationService;
