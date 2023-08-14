import mongoose from "mongoose";

export async function connectToDatabase() {
    ////
    try {
        mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            //
        })

        connection.on('error', (err) => {
            //
            process.exit();
        })

    } catch (error) {
        //
        //

    }
}