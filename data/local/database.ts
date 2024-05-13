import { DataSource } from "typeorm";
import { TaskEntity } from "./task-entity";
import { UserEntity } from "./user-entity";
import { TransactionEntity } from "./transaction-entity";

export const source = new DataSource({
  database: "tasks.db",
  type: "expo",
  driver: require("expo-sqlite"),
  entities: [TaskEntity, UserEntity, TransactionEntity],
  synchronize: true,
});
