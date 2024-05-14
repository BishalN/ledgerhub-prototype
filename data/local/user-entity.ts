import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { TransactionEntity } from "./transaction-entity";

@Entity("user")
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  role: "admin" | "customer";

  // optional description field add
  @Column({ nullable: true })
  description: string;

  @OneToMany(
    () => TransactionEntity,
    (TransactionEntity) => TransactionEntity.user
  )
  transactions: TransactionEntity[];

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
