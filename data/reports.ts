// I need to generate two types of report first as a whole from db
// get all transactions and sum them up using the catergories i.e the type of transaction

// another one is for individual user sum them up using the catergories i.e the type of transaction

// another important thing is i am going to create a bar char so i need data in that form

//NOTE FOR LATER: may be also adding a simple caching mechanism to avoid hitting the db everytime is good

import { TransactionEntity } from "./local/transaction-entity";
import { source } from "./local/database";

export async function generateWholeReport() {
  if (!source.isInitialized) await source.initialize();

  const wholeReport = await TransactionEntity.createQueryBuilder("transaction")
    .select("transaction.type", "type")
    .addSelect("SUM(transaction.amount)", "totalAmount")
    .groupBy("transaction.type")
    .getRawMany();

  return wholeReport.reduce((acc, cur) => {
    acc[cur.type] = cur.totalAmount;
    return acc;
  }, {});
}

export async function generateUserReport(userId: number) {
  if (!source.isInitialized) await source.initialize();

  const userReport = await TransactionEntity.createQueryBuilder("transaction")
    .select("transaction.type", "type")
    .addSelect("SUM(transaction.amount)", "totalAmount")
    .where("transaction.user = :userId", { userId })
    .groupBy("transaction.type")
    .getRawMany();

  return userReport.reduce((acc, cur) => {
    acc[cur.type] = cur.totalAmount;
    return acc;
  }, {});
}
