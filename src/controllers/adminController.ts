import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import _ from 'lodash'
import { TASK_STATUS, USER_ROLES } from "../utils/constant";
import { Users } from '../models/User'
import { Tasks } from "../models/Task";



export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const userList = await Users.find(
      { role: { $ne: USER_ROLES.ADMIN } }  // exclude admin
    ).select("-password"); // optional: hide password

    return res.status(200).send({
      status: "success",
      message: "Data fetched successfully",
      userList
    });

  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).send({
      status: "failed",
      message: "Internal server error"
    });
  }
};

export const getAllAdminUsersController = async (req: Request, res: Response) => {
  try {
    const adminList = await Users.find({ role: USER_ROLES.ADMIN }, { password: 0 }).lean();

    return res.status(200).json({
      status: "success",
      message: "Admin users fetched successfully",
      data: adminList,
    });

  } catch (error) {
    console.error("Error fetching admin users:", error);
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};

export const getAllTasksController = async (req: Request, res: Response) => {
  try {
    //query the database to check if the user exists
    const taskList = await Tasks.find()

    return res.status(200).send({
      status: "success",
      message: "Data fetched successfully",
      taskList
    });

  } catch (error) {
    console.error("Login error:", error);
  }
};

export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const { id: username } = req.params;

    const userWithTasks = await Users.findOne({ username })
      .select("-password")
      .populate("taskDetails")
      .lean();

    if (!userWithTasks) {
      return res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Data fetched successfully",
      userData: userWithTasks,
    });

  } catch (error) {
    console.error("Get user error:", error);
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};

export const createTaskController = async (req: Request & { user?: jwt.JwtPayload }, res: Response) => {
  try {
    const { body, user } = req;

    //ensure user is authenticated
    if (!user?.userId) {
      return res.status(401).send({
        status: "failed",
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    // Check if task already exists in Tasks collection
    const isTaskExist = await Tasks.findOne({ taskId: body.taskId });
    if (isTaskExist) {
      return res.status(409).send({
        status: "failed",
        statusCode: 409,
        message: "Task already exists",
      });
    }

    const taskData = await Tasks.create({
      createdBy: user.userName,
      ...body
    });

    return res.status(201).send({
      status: "success",
      message: "Task created successfully",
      taskDetails: taskData
    });

  } catch (error) {
    console.error("Create task error:", error);
    return res.status(500).send({
      status: "failed",
      statusCode: 500,
      message: "Internal server error",
    });
  }
};

export const authorizeTaskController = async (
  req: Request & { user?: jwt.JwtPayload },
  res: Response
) => {
  try {
    const { taskId } = req.params;
    const user = req.user;

    // Check authentication
    if (!user?.userId) {
      return res.status(401).json({
        status: "failed",
        message: "Unauthorized",
      });
    }

    // Find task
    const task = await Tasks.findOne({ taskId });

    if (!task) {
      return res.status(404).json({
        status: "failed",
        message: "Task not found",
      });
    }

    if (!task.requestedForAuthorization) {
      return res.status(400).json({
        status: "failed",
        message: "Task not requested for authorization",
      });
    }

    if (task.status === TASK_STATUS.COMPLETED) {
      return res.status(409).json({
        status: "failed",
        message: "Task already authorized",
      });
    }

    // Update task
    task.status = TASK_STATUS.COMPLETED;
    task.authorizedBy = user.userId;

    await task.save();

    return res.status(200).json({
      status: "success",
      message: "Task authorized successfully",
      data: task,
    });

  } catch (error) {
    console.error("Authorize task error:", error);
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};
