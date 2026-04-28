async function main() {
  console.info("BalanceSphere Phase 0 seed placeholder");
  console.info("No database writes run in Phase 0.");
  console.info("Seed data lands in Phase 1 after schema validation and initial migrations.");
}

main()
  .catch((error: unknown) => {
    console.error("Seed execution failed", error);
    process.exitCode = 1;
  });