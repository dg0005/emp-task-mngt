import {Schema, model} from "mongoose";
import { TASK_STATUS } from "../utils/constant";

interface Task {
    taskId: string;
    taskName: string;
    taskDescription?: string;
    createdBy: string;
    assignedTo?: string;
    authorizedBy?: string;
    status: typeof TASK_STATUS[keyof typeof TASK_STATUS];
    startDate?: Date;
    endDate?: Date;
    requestedForAuthorization?: boolean;
}


const taskSchema = new Schema<Task>({
    taskId: {
        type: String,
        required: true,
        unique: true
    },
    taskName: {
        type: String,
        required: true
    },
    taskDescription: {
        type: String
    },
    createdBy:{
        type:String
    },
    assignedTo:{
        type:String,
        default: ''
    },
    authorizedBy:{
        type:String,
    },
    status: {
    type: String,
    enum: Object.values(TASK_STATUS),
    default: TASK_STATUS.NOT_STARTED,
  },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date
    },
    requestedForAuthorization: {
        type: Boolean,
    },
});

export type TaskType = typeof taskSchema 
export const Tasks = model<Task>('Tasks', taskSchema);