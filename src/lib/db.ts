import mongoose from 'mongoose';

interface GlobalMongo {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: GlobalMongo;
}

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb+srv://root:root@miraki-training.gn5hy.mongodb.net/gamyam-crud?retryWrites=true&w=majority&appName=Miraki-Training";

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

async function dbConnect(): Promise<typeof mongoose> {
  if (global.mongoose.conn) {
    return global.mongoose.conn;
  }

  if (!global.mongoose.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };

    global.mongoose.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    const mongoose = await global.mongoose.promise;
    global.mongoose.conn = mongoose;
  } catch (e) {
    global.mongoose.promise = null;
    throw e;
  }

  return global.mongoose.conn;
}

export default dbConnect; 