import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var __mongooseConn: { promise: Promise<typeof mongoose> | null; conn: typeof mongoose | null } | undefined;
}

const globalState =
  global.__mongooseConn ?? (global.__mongooseConn = { promise: null, conn: null });

export async function connectMongo() {
  if (globalState.conn) return globalState.conn;

  const uri = process.env.DATABASE_URL;
  if (!uri) {
    throw new Error("DATABASE_URL environment variable is required (MongoDB connection string)");
  }

  if (!globalState.promise) {
    globalState.promise = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 10_000,
      })
      .then((m) => m);
  }

  globalState.conn = await globalState.promise;
  return globalState.conn;
}

export function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

