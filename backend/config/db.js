import mongoose from 'mongoose';

const CONNECTION_TIMEOUT_MS = 10000;

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing from .env');
    }

    const conn = await Promise.race([
      mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: CONNECTION_TIMEOUT_MS,
      }),
      new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error(`MongoDB connection timed out after ${CONNECTION_TIMEOUT_MS / 1000}s`));
        }, CONNECTION_TIMEOUT_MS);
      }),
    ]);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);

    if (error.message.includes('querySrv') || error.message.includes('timed out')) {
      console.error('Atlas SRV DNS lookup failed. Try changing DNS to 8.8.8.8 / 1.1.1.1 or use the Atlas standard mongodb:// connection string.');
    }

    if (error.message.includes('Could not connect to any servers')) {
      console.error('Atlas hosts are unreachable. Check that your network allows outbound TCP 27017, or try a mobile hotspot/VPN.');
    }

    process.exit(1);
  }
};

export default connectDB;
