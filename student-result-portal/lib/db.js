import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // Check if MONGODB_URI is defined
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        // Avoid multiple connections
        if (mongoose.connections[0].readyState) {
            console.log('Already connected to MongoDB');
            return;
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        throw err;
    }
};

export default connectDB;