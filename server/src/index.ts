// server/src/index.ts

import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import express, { Application } from "express";
import { buildSchema } from "type-graphql";
import { AppDataSource } from "./data-source";
import { TaskResolver } from "./resolvers/TaskResolver";
import cors from "cors";
import { expressMiddleware } from "@apollo/server/express4";

async function bootstrap() {
  // Initialize TypeORM DataSource
  await AppDataSource.initialize();
  console.log("📦 Database connected");

  // Build GraphQL schema using TypeGraphQL and the resolver(s)
  const schema = await buildSchema({
    resolvers: [TaskResolver],
    validate: false,
  });

  // Initialize Express app
  const app: Application = express();

  // Enable CORS for all origins (adjust origin in production)
  app.use(cors());

  // Create Apollo Server instance
  const server = new ApolloServer({
    schema,
  });

  // Start the Apollo Server
  await server.start();

  // Apply Apollo GraphQL middleware to Express at /graphql endpoint
  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        // Can extend context here (e.g., user auth info)
        return {};
      },
    })
  );

  // Start the Expess server
  const PORT = 8001;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

// Start the server
bootstrap().catch((error) => {
  console.error("❌ Server failed to start", error);
});
