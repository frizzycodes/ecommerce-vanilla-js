import { MongoClient, ServerApiVersion } from "mongodb";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export let db;

export async function connectDB() {
  if (db) return db; // reuse connection
  // Connect the client to the server	(optional starting in v4.7)
  await client.connect();
  db = client.db("ecommerce");
  console.log("MongoDB connected");
  return db;
}
