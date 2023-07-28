import mongoose from "mongoose";

export async function connectToDatabase() {
    console.log(process.env.MONGO_URI!)
    try {
        mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        })

        connection.on('error', (err) => {
            console.log('%c Error connecting to Cluster: ' + err, 'background: #222; color: #bada55');
            process.exit();
        })

    } catch (error) {
        console.log('%c Error while connecting to Database! ', 'background: #222; color: #bada55');
        console.log(error);

    }
}