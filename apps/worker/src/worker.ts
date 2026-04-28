import { workerEnv } from "./env";

console.info("BalanceSphere worker placeholder started");

const interval = setInterval(() => {
  console.info("Worker heartbeat", {
    timestamp: new Date().toISOString()
  });
}, workerEnv.WORKER_HEARTBEAT_MS);

const stopWorker = () => {
  clearInterval(interval);
  console.info("BalanceSphere worker placeholder stopped");
  process.exit(0);
};

process.on("SIGINT", stopWorker);
process.on("SIGTERM", stopWorker);