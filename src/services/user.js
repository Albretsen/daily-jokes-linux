import { randomBytes } from "crypto";

import { User } from "../models/init.js";
import DatabaseError from "../models/error.js";
import { generatePasswordHash, validatePassword } from "../utils/password.js";
import Coin from "./coin.js";
import ProfilePictureService from "./profile_picture.js";
import ProfileBackgroundService from "./profile_background.js";

const generateRandomToken = () =>
  randomBytes(48).toString("base64").replace(/[+/]/g, ".");

class UserService {
  static async getUsersByIds(userIds) {
    try {
      const users = await User.findMany({
        where: {
          id: {
            in: userIds,
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          profile: true,
          createdAt: true,
          expoPushToken: true,
        },
      });

      return users;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async getPublicUserInfo(userId) {
    try {
      const user = await User.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          role: true,
          profile: true,
          createdAt: true,
          backgroundId: true,
        },
      });

      if (!user) throw new Error("User not found");

      return user;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async list() {
    try {
      const users = await User.findMany();
      return users.map((u) => ({ ...u, password: undefined }));
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async get(id) {
    try {
      const user = await User.findUnique({
        where: { id },
        include: {
          profilePictures: true,
          profileBackgrounds: true,
        }
      });

      if (!user) return null;

      delete user.password;
      return user;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async update(id, data) {
    try {
      return User.update(
        {
          where: { id },
          data: data,
        }
      );
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async delete(id) {
    try {
      return User.delete({
        where: { id },
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async authenticateWithPassword(email, password) {
    try {
      const user = await User.findUnique({
        where: { email },
        include: {
          profilePictures: true,
          profileBackgrounds: true,
        }
      });
      if (!user) return null;

      const passwordValid = await validatePassword(password, user.password);

      if (!passwordValid) return null;

      user.lastLoginAt = new Date();
      const updatedUser = await User.update({
        where: { id: user.id },
        data: { lastLoginAt: user.lastLoginAt },
      });

      delete updatedUser.password;
      return updatedUser;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async authenticateWithToken(token) {
    try {
      let user = await User.findUnique({
        where: { token },
        include: {
          profilePictures: true,
          profileBackgrounds: true,
        }
      });
      if (!user) return null;

      delete user.password;
      user = { ...user, token: token }
      return user;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async createUser({ password, ...userData }) {
    const hash = await generatePasswordHash(password);

    try {
      const data = {
        ...userData,
        password: hash,
        token: generateRandomToken(),
      };

      const user = await User.create({ data });

      await Coin.create({
        userId: user.id,
      });

      const backgroundIds = [0, 1]; 
      for (const backgroundId of backgroundIds) {
        await ProfileBackgroundService.create({
            userId: user.id,
            backgroundId: backgroundId.toString(),
        });
      }

      const pictureIds = [0, 1, 2, 3, 4, 5]; 
      for (const pictureId of pictureIds) {
        await ProfilePictureService.create({
            userId: user.id,
            pictureId: pictureId.toString(),
        });
      }

      delete user.password;
      return this.authenticateWithToken(user.token);
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async setPassword(user, password) {
    user.password = await generatePasswordHash(password); // eslint-disable-line

    try {
      if (user.id) {
        return User.update({
          where: { id: user.id },
          data: { password: user.password },
        });
      }

      return user;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  static async regenerateToken(user) {
    user.token = generateRandomToken(); // eslint-disable-line

    try {
      if (user.id) {
        return User.update({
          where: { id: user.id },
          data: { password: user.password },
        });
      }

      return user;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
}

export default UserService;
