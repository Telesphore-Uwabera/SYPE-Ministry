import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/sype-ministry';

async function migrate() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected.');

    const collection = mongoose.connection.collection('committee_members');

    const result = await collection.updateMany(
        { category: 'board_chancellors' },
        { $set: { category: 'board_counsellors' } }
    );

    console.log(`Updated ${result.modifiedCount} documents.`);

    await mongoose.disconnect();
    console.log('Disconnected.');
    process.exit(0);
}

migrate().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
