import { z } from "zod";

const apiEnvSchema = z.object({
  API_PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development")
});

export const apiEnv = apiEnvSchema.parse(process.env);