import "reflect-metadata";
import { DataSource } from "typeorm";
import { Task } from "./entities/Task";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "B@l@ji#369_",
  database: "task_manager",
  entities: [Task],
  synchronize: true,
  logging: false,
});
