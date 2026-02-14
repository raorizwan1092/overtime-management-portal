import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
const NODE_ENV = process.env.NEXT_NODE_ENV;

if (NODE_ENV === 'production' && !MONGODB_URI) {
    throw new Error('❌ Please define the MONGODB_URI environment variable in production');
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export default async function connectDB() {
    if (NODE_ENV !== 'production') {
        throw new Error('⚠️ MongoDB connection is only allowed in production mode');
    }

    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
        });
    }

    try {
        cached.conn = await cached.promise;
        console.log('✅ Connected to MongoDB (production)');
        return cached.conn;
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        cached.promise = null;
        throw err;
    }
}