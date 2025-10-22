import { BaseModel } from "./BaseModel.js";
import prisma from "../utils/prisma.js";

class UserModel extends BaseModel {
  constructor(prisma) {
    super(prisma, "user");
  }

  async getAllUsers() {
    return await this.findMany({
      where: {
        deleted_at: null,
      },
    });
  }
}

export default new UserModel(prisma);
