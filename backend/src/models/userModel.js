import { BaseModel } from "./BaseModel.js";

export default class UserModel extends BaseModel {
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
