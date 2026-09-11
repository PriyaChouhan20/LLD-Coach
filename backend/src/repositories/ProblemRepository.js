import { ProblemModel } from './schemas/ProblemSchema.js';
import { isUsingInMemoryStore } from '../config/database.js';

export class ProblemRepository {
  static inMemoryProblems = new Map();

  async findAll() {
    if (isUsingInMemoryStore()) {
      return Array.from(ProblemRepository.inMemoryProblems.values());
    }
    try {
      const docs = await ProblemModel.find().lean();
      return docs.map((doc) => ({
        ...doc,
        id: doc._id ? doc._id.toString() : doc.id,
      }));
    } catch {
      return Array.from(ProblemRepository.inMemoryProblems.values());
    }
  }

  async findBySlug(slug) {
    if (isUsingInMemoryStore()) {
      for (const p of ProblemRepository.inMemoryProblems.values()) {
        if (p.slug === slug) return p;
      }
      return null;
    }
    try {
      const doc = await ProblemModel.findOne({ slug }).lean();
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

  async findById(id) {
    if (isUsingInMemoryStore()) {
      return ProblemRepository.inMemoryProblems.get(id) || null;
    }
    try {
      const doc = await ProblemModel.findById(id).lean();
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

  async upsert(problem) {
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
          const result = {
            ...updated,
            id: updated._id ? updated._id.toString() : id,
          };
          ProblemRepository.inMemoryProblems.set(result.id, result);
          return result;
        }
      } catch (err) {
        console.warn(`[ProblemRepository] Mongoose upsert failed (${err.message}). Stored in memory.`);
      }
    }
    return problem;
  }

  async count() {
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
