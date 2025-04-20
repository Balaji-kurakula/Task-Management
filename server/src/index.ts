import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import express, { Application } from "express";
import { buildSchema } from "type-graphql";
import { AppDataSource } from "./data-source";
import { TaskResolver } from "./resolvers/TaskResolver";
import cors from "cors";
import { expressMiddleware } from "@apollo/server/express4";

async function bootstrap() {

  await AppDataSource.initialize();
  console.log("Database connected");

  const schema = await buildSchema({
    resolvers: [TaskResolver],
    validate: false,
  });

  const app: Application = express();

  app.use(cors());

  const server = new ApolloServer({
    schema,
  });

  await server.start();

  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        return {};
      },
    })
  );

  const PORT = 8001;
  app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}/graphql`);
  });
}

bootstrap().catch((error) => {
  console.error("Server failed to start", error);
});
