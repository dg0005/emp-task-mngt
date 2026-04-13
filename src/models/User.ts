import { Schema, model } from "mongoose";
import { USER_ROLES } from "../utils/constant";

interface User {
  username: string;
  password: string;
  name?: string;
  email?: string;
  deptId?: string;
  deptName?: string;
  role: typeof USER_ROLES[keyof typeof USER_ROLES];
  mobileNumber?: string;
  taskDetails?: Schema.Types.ObjectId[]; // Reference to Task model
}


const userSchema = new Schema<User>({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String, required: true
  },
  name: {
    type: String
  },
  email: {
    type: String
  },
  deptId: {
    type: String
  },
  deptName: {
    type: String
  },
  role: {
    type: String,
    enum: [USER_ROLES.ADMIN, USER_ROLES.USER],
  },
  mobileNumber: { type: String },
  taskDetails: [{
    type: Schema.Types.ObjectId,
    ref: 'Tasks',
    isRequired: false
  }],

});

export const Users = model<User>('Users', userSchema);

