import express from 'express';
import { USER_ROLES } from '../utils/constant';
import { taskSchema } from '../validators/useValidators';
import { authorizeTaskController, createTaskController, getAllAdminUsersController,
getAllTasksController, getAllUsersController, getUserByIdController } from '../controllers/adminController';
import { claimTaskController, updateTaskStatusController } from '../controllers/userControllers';
import verifyToken from '../middleware/verifyToken';
import verifyRole from '../middleware/verifyRole';
import validate from '../middleware/validate';

const router = express.Router();

router.get('/getAllTasks', verifyToken, getAllTasksController);

router.put('/claimTask/:taskId', verifyToken, verifyRole([USER_ROLES.USER]),claimTaskController);
router.put('/updateTaskStatus/:taskId', verifyToken, verifyRole([USER_ROLES.USER]),updateTaskStatusController);

router.get('/getAllUsers', verifyToken, verifyRole([USER_ROLES.ADMIN]), getAllUsersController);
router.get('/getAllAdmins', verifyToken, verifyRole([USER_ROLES.ADMIN]), getAllAdminUsersController);
router.get('/getUser/:id',verifyToken,verifyRole([USER_ROLES.ADMIN]), getUserByIdController);

router.put('/authorize/:taskId', verifyToken, verifyRole([USER_ROLES.ADMIN]),authorizeTaskController);

router.post('/createTask',verifyToken,verifyRole([USER_ROLES.ADMIN]), validate(taskSchema), createTaskController);




export default router