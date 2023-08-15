import mongoose from "mongoose";

// export async function connectToDatabase() {
//     try {
//         mongoose.connect(process.env.MONGO_URI!);
//         const connection = mongoose.connection;

//         connection.on('connected', () => {
//         })

//         connection.on('error', (err) => {
//             process.exit();
//         })

//     } catch (error) {
//     }
// }

let isConnected = false; // track the connection

export const connectToDatabase = async () => {

    if (isConnected) {
        console.log('MongoDB is already connected');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI!)

        isConnected = true;

        console.log('MongoDB connected')
    } catch (error) {
        console.log(error);
    }
}