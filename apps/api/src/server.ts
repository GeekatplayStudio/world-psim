import { apiEnv } from "./env";
import { createApi } from "./app";

async function start() {
  const app = createApi();

  try {
    await app.listen({
      host: "0.0.0.0",
      port: apiEnv.API_PORT
    });
  } catch (error: unknown) {
    app.log.error(error);
    process.exitCode = 1;
  }
}

void start();