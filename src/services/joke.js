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

  static async findByCriteria({ filters, sortBy, exclude }) {
    const whereClause = buildWhereClause(filters, exclude);
    const orderByClause = buildOrderByClause(sortBy);
    return await executeQuery(whereClause, orderByClause);
  }

}

export default JokeService;

function buildWhereClause(filters, exclude) {
  const whereClause = {};

  if (filters) {
    Object.keys(filters).forEach(key => {
      whereClause[key] = filters[key];
    });
  }

  if (exclude) {
    Object.keys(exclude).forEach(key => {
      if (whereClause[key]) {
        whereClause[key] = { ...whereClause[key], not: exclude[key] };
      } else {
        whereClause[key] = { not: exclude[key] };
      }
    });
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

async function executeQuery(whereClause, orderByClause) {
  try {
    return await Joke.findMany({
      where: whereClause,
      orderBy: orderByClause,
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
