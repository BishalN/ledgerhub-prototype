import { Like } from "typeorm";
import { source } from "./local/database";
import { UserEntity } from "./local/user-entity";

export class UserRepository {
  async getCustomers(): Promise<UserEntity[]> {
    if (!source.isInitialized) await source.initialize();

    const customers = await UserEntity.find({
      where: {
        role: "customer",
      },
    });

    return customers;
  }

  async getCustomer(customerId: UserEntity["id"]): Promise<UserEntity> {
    if (!source.isInitialized) await source.initialize();

    const customer = await UserEntity.findOneByOrFail({
      id: customerId,
    });
    return customer;
  }

  async getCustomersByName(
    customerName: UserEntity["name"]
  ): Promise<UserEntity[]> {
    if (!source.isInitialized) await source.initialize();

    // find many user
    const customer = await UserEntity.find({
      select: {
        id: true,
        name: true,
        description: true,
      },
      where: {
        name: Like(`%${customerName}%`),
        role: "customer",
      },
    });
    return customer;
  }

  async getAdmins(): Promise<UserEntity[]> {
    if (!source.isInitialized) await source.initialize();

    const admins = await UserEntity.find({
      where: {
        role: "admin",
      },
    });

    return admins;
  }

  async createCustomer(payload: Pick<UserEntity, "name" | "description">) {
    if (!source.isInitialized) await source.initialize();

    const customer = new UserEntity();
    customer.name = payload.name;
    customer.description = payload.description;
    customer.role = "customer";
    await customer.save();
  }

  async createAdmin(payload: Pick<UserEntity, "name" | "description">) {
    if (!source.isInitialized) await source.initialize();

    const admin = new UserEntity();
    admin.name = payload.name;
    admin.description = payload.description;
    admin.role = "admin";
    await admin.save();
  }

  async updateCustomer(
    customerId: UserEntity["id"],
    payload: Pick<UserEntity, "name" | "description">
  ) {
    if (!source.isInitialized) await source.initialize();

    const customer = await UserEntity.findOneByOrFail({ id: customerId });
    customer.name = payload.name;
    customer.description = payload.description;
    await customer.save();
  }

  async updateAdmin(
    adminId: UserEntity["id"],
    payload: Pick<UserEntity, "name" | "description">
  ) {
    if (!source.isInitialized) await source.initialize();

    const admin = await UserEntity.findOneByOrFail({ id: adminId });
    admin.name = payload.name;
    admin.description = payload.description;
    await admin.save();
  }

  async deleteCustomer(customerId: UserEntity["id"]) {
    if (!source.isInitialized) await source.initialize();

    await UserEntity.delete(customerId);
  }
}
