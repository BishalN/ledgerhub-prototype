import { source } from "./local/database";
import { TransactionEntity } from "./local/transaction-entity";

export class TransactionRepository {
  async getTransactions(): Promise<TransactionEntity[]> {
    if (!source.isInitialized) await source.initialize();

    const transactions = await TransactionEntity.find();

    return transactions;
  }

  async getTransaction(
    transactionId: TransactionEntity["id"]
  ): Promise<TransactionEntity> {
    if (!source.isInitialized) await source.initialize();

    const transaction = await TransactionEntity.findOneByOrFail({
      id: transactionId,
    });
    return transaction;
  }

  async createTransaction(
    payload: Pick<TransactionEntity, "amount" | "type" | "user">
  ) {
    if (!source.isInitialized) await source.initialize();

    const transaction = new TransactionEntity();
    transaction.amount = payload.amount;
    transaction.type = payload.type;
    transaction.user = payload.user;
    await transaction.save();
  }

  async updateTransaction(
    transactionId: TransactionEntity["id"],
    payload: Partial<Pick<TransactionEntity, "amount" | "type" | "user">>
  ) {
    if (!source.isInitialized) await source.initialize();

    const transaction = await TransactionEntity.findOneByOrFail({
      id: transactionId,
    });
    transaction.amount = payload.amount ?? transaction.amount;
    transaction.type = payload.type ?? transaction.type;
    transaction.user = payload.user ?? transaction.user;
    await transaction.save();
  }

  async deleteTransaction(transactionId: TransactionEntity["id"]) {
    if (!source.isInitialized) await source.initialize();

    await TransactionEntity.delete(transactionId);
  }
}
