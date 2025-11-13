import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

// ✅ Show in console whether the URI is found or missing
console.log("🔍 Checking MongoDB URI...");
if (!uri) {
  console.error("❌ MONGODB_URI environment variable is NOT defined!");
  throw new Error("MONGODB_URI environment variable is not defined");
} else {
  console.log("✅ MONGODB_URI found:", uri);
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!(global as any).mongoClientPromise) {
    console.log("🚀 Connecting to MongoDB (development mode)...");
    client = new MongoClient(uri);
    (global as any).mongoClientPromise = client.connect();
  } else {
    console.log("⚡ Reusing existing MongoDB connection (development mode).");
  }
  clientPromise = (global as any).mongoClientPromise;
} else {
  console.log("🚀 Connecting to MongoDB (production mode)...");
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

// ✅ Log successful connection
clientPromise
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

export default clientPromise;
