import { Schema, model, models } from 'mongoose';
import taskModel from "./taskModel";

const UserSchema = new Schema({
    email: {
        type: String,
        unique: [true, 'Email already exists!'],
        required: [true, 'Email is required!'],
    },
    username: {
        type: String,
        required: [true, 'Username is required!'],
        match: [/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/, "Username invalid, it should contain 8-20 alphanumeric letters and be unique!"]
    },
    taskList: [{ type: Schema.Types.ObjectId, ref: taskModel }]
    //changed from taskModel to file
});

const UserModel = models.User || model("User", UserSchema);

export default UserModel;


// {
//     "_id": ObjectId("user_id"),
//     "name": "John Doe",
//     "email": "john.doe@example.com",
//     "password": "hashed_password",
//     "subscription": {
//       "status": "active",
//       "expires_at": ISODate("2023-08-31T23:59:59Z"),
//       "plan": "premium"
//     },
//     "other_fields": "..."
//   }
