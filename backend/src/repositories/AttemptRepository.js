import { AttemptModel } from './schemas/AttemptSchema.js';
import { isUsingInMemoryStore } from '../config/database.js';

export class AttemptRepository {
  static inMemoryAttempts = new Map();

  async findById(id) {
    if (isUsingInMemoryStore()) {
      return AttemptRepository.inMemoryAttempts.get(id) || null;
    }
    try {
      const doc = await AttemptModel.findById(id).lean();
      if (!doc) {
        return AttemptRepository.inMemoryAttempts.get(id) || null;
      }
      return {
        ...doc,
        id: doc._id ? doc._id.toString() : doc.id,
      };
    } catch {
      return AttemptRepository.inMemoryAttempts.get(id) || null;
    }
  }

  async findByUserId(userId) {
    if (isUsingInMemoryStore()) {
      return Array.from(AttemptRepository.inMemoryAttempts.values())
        .filter(a => !userId || a.userId === userId || userId === 'all')
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }
    try {
      const query = userId && userId !== 'all' ? { userId } : {};
      const docs = await AttemptModel.find(query).sort({ updatedAt: -1 }).lean();
      return docs.map((doc) => ({
        ...doc,
        id: doc._id ? doc._id.toString() : doc.id,
      }));
    } catch {
      return Array.from(AttemptRepository.inMemoryAttempts.values())
        .filter(a => !userId || a.userId === userId || userId === 'all')
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }
  }

  async findByProblemAndUser(problemId, userId) {
    if (isUsingInMemoryStore()) {
      return Array.from(AttemptRepository.inMemoryAttempts.values())
        .filter(a => a.problemId === problemId && a.userId === userId)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }
    try {
      const docs = await AttemptModel.find({ problemId, userId }).sort({ updatedAt: -1 }).lean();
      return docs.map((doc) => ({
        ...doc,
        id: doc._id ? doc._id.toString() : doc.id,
      }));
    } catch {
      return Array.from(AttemptRepository.inMemoryAttempts.values())
        .filter(a => a.problemId === problemId && a.userId === userId);
    }
  }

  async save(attempt) {
    const id = attempt.id;
    AttemptRepository.inMemoryAttempts.set(id, attempt);

    if (!isUsingInMemoryStore()) {
      try {
        const { id: _, ...rest } = attempt;
        const saved = await AttemptModel.findOneAndUpdate(
          { _id: attempt.id },
          { $set: { _id: attempt.id, ...rest } },
          { upsert: true, new: true }
        ).lean();

        if (saved) {
          const result = {
            ...saved,
            id: saved._id || attempt.id,
          };
          AttemptRepository.inMemoryAttempts.set(result.id, result);
          return result;
        }
      } catch (err) {
        console.warn(`[AttemptRepository] Mongoose save failed (${err.message}). Stored in memory.`);
      }
    }
    return attempt;
  }
}
