import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { createProblemRouter } from './routes/problemRoutes.js';
import { createAttemptRouter } from './routes/attemptRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { ProblemRepository } from './repositories/ProblemRepository.js';
import { AttemptRepository } from './repositories/AttemptRepository.js';
import { EvaluationService } from './services/EvaluationService.js';
import { runSeeder } from './data/seed/seedRunner.js';

export function createApp(deps = {}) {
  const app = express();

  // Middlewares
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
  app.use(express.json({ limit: '2mb' }));

  // Health check
  app.get('/api/health', (_, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'lld-coach-backend',
    });
  });

  // API Routes
  const problemRepo = deps.problemRepo || new ProblemRepository();
  const attemptRepo = deps.attemptRepo || new AttemptRepository();
  const evaluationService = deps.evaluationService || new EvaluationService();

  app.use('/api/problems', createProblemRouter(problemRepo));
  app.use('/api/attempts', createAttemptRouter(attemptRepo, problemRepo, evaluationService));

  // Global Error Handler
  app.use(errorHandler);

  return app;
}

export async function startServer() {
  await connectDatabase();

  const problemRepo = new ProblemRepository();
  // Auto-seed problem catalog if empty
  await runSeeder(problemRepo);

  const app = createApp({ problemRepo });
  const port = parseInt(config.PORT, 10) || 5000;

  const server = app.listen(port, () => {
    console.log(`=========================================`);
    console.log(`🚀 LLD Coach Backend is running on port ${port}`);
    console.log(`🌐 Health endpoint: http://localhost:${port}/api/health`);
    console.log(`📚 Problems endpoint: http://localhost:${port}/api/problems`);
    console.log(`🤖 AI Provider mode: ${config.AI_PROVIDER}`);
    console.log(`=========================================`);
  });

  return { app, server };
}

// Auto start if run directly
if (process.env.NODE_ENV !== 'test' && (process.argv[1]?.endsWith('app.js') || process.argv[1]?.endsWith('src\\app.js'))) {
  startServer().catch(err => {
    console.error('Fatal startup error:', err);
    process.exit(1);
  });
}
