export enum USER_ROLES {
    ADMIN = 'ADMIN',
    USER = 'USER',
};

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export enum DEPT_NAMES {
    JS = 'JS',
    IT = 'IT',
    Finance = 'Finance',
    HR = 'HR',
};

export type DeptName = typeof DEPT_NAMES[keyof typeof DEPT_NAMES];

export enum TASK_STATUS {
    NOT_STARTED = 'NOT_STARTED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
};

export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];

export const OperationSuccess = {    
    status: "success",
    message: "Operation completed successfully",
}


export const ErrorObject = {
      status: "failed",
      statusCode: 500,
      message: "Unable to process",
    }