import { Notification } from "../models/init.js";
import DatabaseError from "../models/error.js";
import UserService from "./user.js";

class NotificationService {
    static async sendNotifications(messages) {
        const userIds = messages.map(message => message.userId);
        const users = await UserService.getUsersByIds(userIds);
        const userMap = new Map(users.map(user => [user.id, user.expoPushToken]));

        const notifications = messages.filter(message => {
            const expoId = userMap.get(message.userId);
            return expoId && /^ExponentPushToken\[.+\]$/.test(expoId);
        }).map(message => {
            const expoId = userMap.get(message.userId);
            return { ...message, token: expoId };
        });

        const messageBatches = this.chunkArray(notifications, 100);

        for (const batch of messageBatches) {
            await this.sendExpoNotifications(batch);
        }

        messages.forEach(async (message) => {
            const notificationData = {
                userId: message.userId,
                title: message.title,
                body: message.body,
                data: typeof(message.data) === 'object' ? message.data : {},
            };

            try {
                await Notification.create({ data: notificationData });
            } catch (err) {
                console.error(`Error creating notification in DB for userId ${message.userId}:`, err);
            }
        });
    }

    static async sendExpoNotifications(messages) {
        const expoApiUrl = 'https://exp.host/--/api/v2/push/send';
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip, deflate'
        };

        const notifications = messages.map(({ token, title, body, data }) => ({
            to: token,
            title: title,
            body: body,
            data: data,
        }));

        try {
            const response = await fetch(expoApiUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(notifications),
            });

            const jsonResponse = await response.json();

            if (jsonResponse.data && jsonResponse.data.some(notification => notification.status === 'error')) {
                const errorMessages = jsonResponse.data.filter(notification => notification.status === 'error').map(notification => notification.message);

                throw new Error(`Errors occurred with some notifications: ${errorMessages.join("; ")}`);
            }

            console.log(jsonResponse);

            return jsonResponse;
        } catch (error) {
            console.error("Error sending Expo notifications:", error);
        }
    }

    static chunkArray(array, size) {
        const chunkedArr = [];
        for (let i = 0; i < array.length; i += size) {
            chunkedArr.push(array.slice(i, i + size));
        }
        return chunkedArr;
    }

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
        console.log("hey 2");
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

    static async findByCriteria({ filters, exclude, pagination }) {
        const whereClause = buildWhereClause(filters, exclude);
        const paginationClause = calculatePagination(pagination);
        return await executeQuery(whereClause, paginationClause);
    }
}

function buildWhereClause(filters, exclude) {
    const whereClause = {};

    if (filters) {
        Object.keys(filters).forEach(key => {
            whereClause[key] = filters[key];
        });
    }

    if (exclude) {
        Object.keys(exclude).forEach(key => {
            if (exclude[key].notIn) {
                whereClause[key] = { notIn: exclude[key].notIn };
            } else if (exclude[key].not !== undefined) {
                whereClause[key] = { not: exclude[key].not };
            }
        });
    }

    return whereClause;
}

const MAX_PAGE_SIZE = 10;
function calculatePagination(pagination = {}) {
    if (!pagination.page) pagination.page = 1;
    if (!pagination.page_size) pagination.page_size = MAX_PAGE_SIZE;
    if (pagination.page_size > MAX_PAGE_SIZE) pagination.page_size = MAX_PAGE_SIZE;

    const offset = (pagination.page - 1) * pagination.page_size;
    return { skip: offset, take: pagination.page_size };
}

async function executeQuery(whereClause, { skip, take }) {
    try {
        return await Notification.findMany({
            where: whereClause,
            skip,
            take,
        });
    } catch (err) {
        throw new DatabaseError(err);
    }
}

export default NotificationService;
