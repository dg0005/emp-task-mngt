import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import _ from 'lodash'
import { ErrorObject, TASK_STATUS } from "../utils/constant";
import { Tasks } from "../models/Task";

export const claimTaskController = async (req: Request & { user?: jwt.JwtPayload }, res: Response) => {
    try {
        const { taskId } = req.params;
        const user = req.user;
        
        if (!user?.userId || !taskId) {
            return res.status(400).send({
                status: "failed",
                message: "UserId or taskId missing",
            });
        }
        console.log("🚀 ~ claimTaskController ~ taskId:", taskId)

        const updatedTask = await Tasks.findOneAndUpdate(
            {
                taskId: taskId,
                assignedTo: { $exists: false }, // value check for task not claimed
            },
            {
                assignedTo: user.userName,
                status: TASK_STATUS.IN_PROGRESS,
            },
            {
                returnDocument: "after",
            }
        );
        console.log("🚀 ~ claimTaskController ~ updatedTask:", updatedTask)

        if (updatedTask) {
            return res.status(200).send({
                status: "success",
                message: "Task claimed successfully",
                data: updatedTask,
            });
        }

        return res.status(400).send({
            status: "failed",
            message: "Task claim failed",
        });

    } catch (error) {
        console.error("Claim task error:", error);
        return res.status(500).send(ErrorObject);
    }
};

export const updateTaskStatusController = async (req: Request & { user?: jwt.JwtPayload }, res: Response) => {
    try {
        const { taskId } = req.params;
        const user = req.user;

        if (!user?.userId || !user?.userName || !taskId) {
            return res.status(400).send({
                status: "failed",
                message: "User authentication or taskId missing",
            });
        }

        const updatedTask = await Tasks.findOneAndUpdate(
            {
                taskId,
                assignedTo: user.userName, // ensures authorization in query itself
            },
            {
                requestedForAuthorization: true,
            },
            {
                returnDocument: "after",
            }
        );

        if (!updatedTask) {
            return res.status(404).send({
                status: "failed",
                message: "Task not found or not assigned to you",
            });
        }

        return res.status(200).send({
            status: "success",
            message: "Task updated successfully",
        });

    } catch (error) {
        console.error("Update task error:", error);
        return res.status(500).send(ErrorObject);
    }
};