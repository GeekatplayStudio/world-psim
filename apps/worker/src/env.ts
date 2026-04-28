import { z } from "zod";

const workerEnvSchema = z.object({
  WORKER_HEARTBEAT_MS: z.coerce.number().int().positive().default(15000),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development")
});

export const workerEnv = workerEnvSchema.parse(process.env);