import { z } from 'zod';
import { DEPT_NAMES, TASK_STATUS, USER_ROLES } from '../utils/constant';


export const registerUserSchema = z.object({
    username: z.string().max(8, 'Username can not exceed 8 characters').nonempty('Username is required'),
    password: z.string().max(14, 'Password can not exceed 14 characters').nonempty('Password is required'),
    name: z.string().max(50, 'Name can not exceed 50 characters').nonempty('Name is required'),
    email: z.email('Invalid email address').nonempty('Email is required'),
    deptId: z.string().max(2, 'Password can not exceed 14 characters'),
    deptName: z.enum([DEPT_NAMES.JS, DEPT_NAMES.IT, DEPT_NAMES.Finance, DEPT_NAMES.HR], 'Invalid department name'),
    role: z.enum([USER_ROLES.ADMIN, USER_ROLES.USER], 'Role must be either admin or user'),
    mobileNumber: z.string().trim().regex(/^(\+91)?[6-9]\d{9}$/, 'Invalid mobile number').transform((val) => val.replace(/^\+91/, '')), // s
});

export const loginUserSchema = z.object({
    username: z.string().max(8, 'Username can not exceed 8 characters').nonempty('Username is required'),
    password: z.string().max(14, 'Password can not exceed 14 characters').nonempty('Password is required'),
});


export const taskSchema = z.object({
    taskId: z.string().max(20, 'Task ID can not exceed 20 characters').nonempty('Task ID is required'),
    taskName: z.string().max(100, 'Task name can not exceed 100 characters').nonempty('Task name is required'),
    taskDescription: z.string().max(200, 'Task description can not exceed 200 characters'),
    status: z.enum([TASK_STATUS.COMPLETED, TASK_STATUS.IN_PROGRESS, TASK_STATUS.NOT_STARTED], 'Invalid task status'),
    startDate: z.string().optional(),
    endDate: z.string().optional()
});
 
