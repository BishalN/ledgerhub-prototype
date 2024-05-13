import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "./user-entity";

@Entity("transaction")
export class TransactionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column()
  type: "receivable" | "received" | "payable" | "paid";

  @ManyToOne(() => UserEntity, (UserEntity) => UserEntity.id, { eager: true })
  user: UserEntity;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
