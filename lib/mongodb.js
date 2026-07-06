import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('MONGO_URI environment variable is not set');
}

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // In development, use a global variable so the MongoClient is not
  // repeatedly created during hot-reloading.
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGO_URI);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(MONGO_URI);
  clientPromise = client.connect();
}

export default clientPromise;
