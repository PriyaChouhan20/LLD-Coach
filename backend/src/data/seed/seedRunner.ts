import { connectDatabase, disconnectDatabase } from '../../config/database.js';
import { ProblemRepository } from '../../repositories/ProblemRepository.js';
import { SEED_PROBLEMS } from './problems.seed.js';

export async function runSeeder(problemRepo?: ProblemRepository): Promise<void> {
  console.log('[Seeder] Initializing LLD problem catalog...');
  const repo = problemRepo || new ProblemRepository();

  for (const problem of SEED_PROBLEMS) {
    await repo.upsert(problem);
    console.log(`[Seeder] Seeded problem: "${problem.title}" (${problem.slug})`);
  }

  console.log(`[Seeder] Successfully seeded ${SEED_PROBLEMS.length} LLD problems.`);
}

// Standalone execution support
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('seedRunner.ts')) {
  (async () => {
    try {
      await connectDatabase();
      await runSeeder();
      await disconnectDatabase();
      process.exit(0);
    } catch (err) {
      console.error('[Seeder] Error during seed execution:', err);
      process.exit(1);
    }
  })();
}
