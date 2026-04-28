import type { FastifyInstance } from "fastify";

import { healthResponseSchema, type HealthResponse } from "@balancesphere/shared";

export async function registerHealthRoute(app: FastifyInstance) {
  app.get("/health", async () => {
    const response: HealthResponse = {
      status: "ok",
      service: "balancesphere-api",
      time: new Date().toISOString(),
      version: "0.1.0"
    };

    return healthResponseSchema.parse(response);
  });
}