/**
 * Task routes
 * @module
 */


import express from 'express';
import checkAuth from '../middleware/checkAuth.js';
import {
	getTask,
	newTask,
	changeStateTask,
	udpateTask,
	deleteTask,
} from '../controllers/taskController.js';

const router = express.Router();

/**
 * new Task
 * @name newTask
 * @path {post} /api/tasks/
 */
router.post('/', checkAuth, newTask);

/**
 * get unique task - update task - delete task
 * @name getProject-editProject-deleteProject
 * @path {get-put-delet} /api/tasks/:id
 */
router
	.route('/:id')
	.get(checkAuth, getTask)
	.put(checkAuth, udpateTask)
	.delete(checkAuth, deleteTask);

/**
 * change State task
 * @name changeStateTask
 * @path {post} /api/tasks/state/:id
 */
router.post('/state/:id', checkAuth, changeStateTask);

export default router;
