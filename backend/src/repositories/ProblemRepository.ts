import { Problem } from '../domain/models/Problem.js';
import { ProblemModel } from './schemas/ProblemSchema.js';
import { isUsingInMemoryStore } from '../config/database.js';

export class ProblemRepository {
  private static inMemoryProblems: Map<string, Problem> = new Map();

  public async findAll(): Promise<Problem[]> {
    if (isUsingInMemoryStore()) {
      return Array.from(ProblemRepository.inMemoryProblems.values());
    }
    try {
      const docs = await ProblemModel.find().lean();
      return docs.map((doc: any) => ({
        ...doc,
        id: doc._id ? doc._id.toString() : doc.id,
      }));
    } catch {
      return Array.from(ProblemRepository.inMemoryProblems.values());
    }
  }

  public async findBySlug(slug: string): Promise<Problem | null> {
    if (isUsingInMemoryStore()) {
      for (const p of ProblemRepository.inMemoryProblems.values()) {
        if (p.slug === slug) return p;
      }
      return null;
    }
    try {
      const doc: any = await ProblemModel.findOne({ slug }).lean();
      if (!doc) return null;
      return {
        ...doc,
        id: doc._id ? doc._id.toString() : doc.id,
      };
    } catch {
      for (const p of ProblemRepository.inMemoryProblems.values()) {
        if (p.slug === slug) return p;
      }
      return null;
    }
  }

  public async findById(id: string): Promise<Problem | null> {
    if (isUsingInMemoryStore()) {
      return ProblemRepository.inMemoryProblems.get(id) || null;
    }
    try {
      const doc: any = await ProblemModel.findById(id).lean();
      if (!doc) {
        // Fallback check by slug or in-memory
        return ProblemRepository.inMemoryProblems.get(id) || null;
      }
      return {
        ...doc,
        id: doc._id ? doc._id.toString() : doc.id,
      };
    } catch {
      return ProblemRepository.inMemoryProblems.get(id) || null;
    }
  }

  public async upsert(problem: Problem): Promise<Problem> {
    ProblemRepository.inMemoryProblems.set(problem.id, problem);

    if (!isUsingInMemoryStore()) {
      try {
        const { id, ...rest } = problem;
        const updated = await ProblemModel.findOneAndUpdate(
          { slug: problem.slug },
          { $set: rest },
          { upsert: true, new: true }
        ).lean();

        if (updated) {
          const result: any = {
            ...updated,
            id: (updated as any)._id ? (updated as any)._id.toString() : id,
          };
          ProblemRepository.inMemoryProblems.set(result.id, result);
          return result;
        }
      } catch (err: any) {
        console.warn(`[ProblemRepository] Mongoose upsert failed (${err.message}). Stored in memory.`);
      }
    }
    return problem;
  }

  public async count(): Promise<number> {
    if (isUsingInMemoryStore()) {
      return ProblemRepository.inMemoryProblems.size;
    }
    try {
      return await ProblemModel.countDocuments();
    } catch {
      return ProblemRepository.inMemoryProblems.size;
    }
  }
}
