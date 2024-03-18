import { Joke } from "../models/init.js";
import DatabaseError from "../models/error.js";

class JokeService {
  static async list() {
    try {
      return Joke.findMany();
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async get(id) {
    try {
      return await Joke.findUnique({ where: { id } });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async create(data) {
    try {
      return await Joke.create({ data });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async update(id, data) {
    try {
      return await Joke.update({
        where: { id },
        data,
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async delete(id) {
    try {
      await Joke.delete({ where: { id } });
      return true;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async findByCriteria({ filters, sortBy, exclude, searchQuery, pagination }) {
    const whereClause = buildWhereClause(filters, exclude, searchQuery);
    const orderByClause = buildOrderByClause(sortBy);
    const paginationClause = calculatePagination(pagination);
    return await executeQuery(whereClause, orderByClause, paginationClause);
  }

}

export default JokeService;

const MAX_PAGE_SIZE = 25;
function calculatePagination(pagination = {}) {
  if (!pagination.page) pagination.page = 1;
  if (!pagination.page_size) pagination.page_size = MAX_PAGE_SIZE;
  if (pagination.page_size > MAX_PAGE_SIZE) pagination.page_size = MAX_PAGE_SIZE;

  const offset = (pagination.page - 1) * pagination.page_size;
  return { skip: offset, take: pagination.page_size };
}

function buildWhereClause(filters, exclude, searchQuery) {
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

  if (searchQuery && searchQuery.trim() !== "") {
    whereClause.textBody = {
      contains: searchQuery,
      mode: 'insensitive',
    };
  }

  return whereClause;
}

function buildOrderByClause(sortBy) {
  const orderByClause = [];
  if (sortBy) {
    const [field, order] = sortBy.startsWith('-') ? [sortBy.slice(1), 'desc'] : [sortBy, 'asc'];
    orderByClause.push({ [field]: order });
  }
  return orderByClause;
}

async function executeQuery(whereClause, orderByClause, { skip, take }) {
  try {
    return await Joke.findMany({
      where: whereClause,
      orderBy: orderByClause,
      skip,
      take,
      include: {
        user: {
          select: {
            profile: true,
            name: true,
          }
        },
      },
    });
  } catch (err) {
    throw new DatabaseError(err);
  }
}
