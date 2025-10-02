import mongoose from "mongoose";

const { MONGODB_URI } = process.env;
if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in your .env.local");
}

// reuse cached connection in dev (hot reload)
let cached = global.mongoose || { conn: null, promise: null };
global.mongoose = cached;

export default async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // Optional: faster fail if Atlas not reachable
      serverSelectionTimeoutMS: 8000,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      if (process.env.NODE_ENV !== "production") console.log("DB connected");
      return m; // IMPORTANT: return instance
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
  return cached.conn;
}