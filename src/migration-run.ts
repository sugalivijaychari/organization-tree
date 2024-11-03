import AppDataSource from './data-source';

async function runMigrations() {
  await AppDataSource.initialize();
  await AppDataSource.runMigrations();
  await AppDataSource.destroy();
}

runMigrations().catch((error) => {
  console.error('Error running migrations:', error);
  process.exit(1);
});
