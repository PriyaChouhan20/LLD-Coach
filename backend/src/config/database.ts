import mongoose from 'mongoose';
import { config } from './env.js';

let isInMemoryFallback = false;

// Disable Mongoose command buffering so operations fail immediately instead of hanging when disconnected
mongoose.set('bufferCommands', false);

export async function connectDatabase(): Promise<typeof mongoose | null> {
  try {
    const conn = await mongoose.connect(config.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000,
    });
    console.log(`[Database] MongoDB connected successfully: ${config.MONGODB_URI}`);
    return conn;
  } catch (err: any) {
    console.warn(`[Database] Could not connect to MongoDB at ${config.MONGODB_URI} (${err.message}).`);
    console.info(`[Database] Switching to resilient In-Memory Store for seamless execution without external MongoDB daemon.`);
    isInMemoryFallback = true;
    return null;
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

export function isUsingInMemoryStore(): boolean {
  return isInMemoryFallback || mongoose.connection.readyState !== 1;
}

