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
