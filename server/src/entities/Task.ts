import { Field, ID, ObjectType } from "type-graphql";
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  BaseEntity
} from "typeorm";

@Entity()
@ObjectType()
export class Task extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  title!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field()
  @Column({ default: false })
  completed!: boolean;

  @Field()
  @Column({ default: 0 })
  priority!: number;

  @Field()
  @Column({ default: "" })
  category!: string;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  dueDate?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  isRecurring!: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  recurrencePattern!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  lastRecurrenceDate!: Date;
}