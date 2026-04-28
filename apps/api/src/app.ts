import Fastify from "fastify";

import { registerHealthRoute } from "./routes/health";

export function createApi() {
  const app = Fastify({
    logger: true
  });

  void registerHealthRoute(app);

  return app;
}