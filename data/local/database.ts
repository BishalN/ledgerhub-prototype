import { DataSource } from "typeorm";
import { UserEntity } from "./user-entity";
import { TransactionEntity } from "./transaction-entity";

export const source = new DataSource({
  database: "tasks.db",
  type: "expo",
  driver: require("expo-sqlite"),
  entities: [UserEntity, TransactionEntity],
  synchronize: true,
  logging: true,
});
