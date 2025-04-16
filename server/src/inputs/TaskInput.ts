import { Field, InputType } from "type-graphql";

@InputType()
export class CreateTaskInput {
  @Field()
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true, defaultValue: false })
  completed?: boolean;

  @Field({ nullable: true, defaultValue: 0 })
  priority?: number;

  @Field({ nullable: true, defaultValue: "" })
  category?: string;

  @Field({ nullable: true })
  dueDate?: Date;

  @Field({ nullable: true })
  isRecurring?: boolean;

  @Field({ nullable: true })
  recurrencePattern?: string;
}

@InputType()
export class UpdateTaskInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  completed?: boolean;

  @Field({ nullable: true })
  priority?: number;

  @Field({ nullable: true })
  category?: string;

  @Field({ nullable: true })
  dueDate?: Date;

  @Field({ nullable: true })
  isRecurring?: boolean;

  @Field({ nullable: true })
  recurrencePattern?: string;
} 