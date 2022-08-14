/**
 *
 * @module task-controller
 */

import Task from '../models/Task.js';
import Project from '../models/Project.js';

/**
 * new Task
 * @param {Task} req receive object type Task withouth state
 * @param {*} res response for the client
 * @returns {status} 404 project not exists, 401 not have permission for create task, 200 task created
 */
const newTask = async (req, res) => {
	const { project } = req.body;
	const findProject = await Project.findById(project);
	if (!findProject) {
		const error = new Error("The project doesn't exist");
		return res.status(404).json({ msg: error.message });
	}
	if (findProject.creator.toString() !== req.user._id.toString()) {
		const error = new Error("You don't have permission to create tasks");
		return res.status(401).json({ msg: error.message });
	}
	try {
		const taskStored = await Task.create(req.body);

		//Save id task in project
		findProject.tasks.push(taskStored._id);

		await findProject.save();
		res.json(taskStored);
	} catch (error) {
		console.log(error);
	}
};

/**
 * new Task
 * @param {String} req receive id task
 * @param {*} res response for the client
 * @returns {status} 404 task not exists, 403 if not is creator , 200 task stored
 */
const getTask = async (req, res) => {
	const { id } = req.params;

	let task;

	try {
		//populate is for get all information of ref someobject that is in someschema
		task = await Task.findById(id).populate('project');
	} catch (e) {
		const error = new Error("The task doesn't exist");
		return res.status(404).json({ msg: error.message });
	}

	if (task.project.creator.toString() !== req.user._id.toString()) {
		const error = new Error('Invalid action');
		return res.status(403).json({ msg: error.message });
	}
	res.json(task);
};

/**
 * update Task
 * @param {*} req receive id task, and form task
 * @param {*} res response for the client
 * @returns {status} 404 task not exists, 403 if not is creator , 200 task updated
 */
const udpateTask = async (req, res) => {
	const { id } = req.params;

	let task;

	try {
		//populate is for get all information of ref someobject that is in someschema
		task = await Task.findById(id).populate('project');
	} catch (e) {
		const error = new Error("The task doesn't exist");
		return res.status(404).json({ msg: error.message });
	}

	if (task.project.creator.toString() !== req.user._id.toString()) {
		const error = new Error('Invalid action');
		return res.status(403).json({ msg: error.message });
	}

	task.name = req.body.name || task.name;
	task.description = req.body.description || task.description;
	task.priority = req.body.priority || task.priority;
	task.deliveryDate = req.body.deliveryDate || task.deliveryDate;

	try {
		const taskStored = await task.save();
		res.json(task);
	} catch (error) {
		console.log(error);
	}
};

/**
 * delete Task
 * @param {*} req receive id task
 * @param {*} res response for the client
 * @returns {status} 404 task not exists, 403 if not is creator , 200 task deleted
 */
const deleteTask = async (req, res) => {
	const { id } = req.params;

	let task;

	try {
		//populate is for get all information of ref someobject that is in someschema
		task = await Task.findById(id).populate('project');
	} catch (e) {
		const error = new Error("The task doesn't exist");
		return res.status(404).json({ msg: error.message });
	}

	if (task.project.creator.toString() !== req.user._id.toString()) {
		const error = new Error('Invalid action');
		return res.status(403).json({ msg: error.message });
	}

	try {
		const projectId = task.project._id;
		const projectStored = await Project.findById(projectId);
		const tasks = projectStored.tasks.filter(
			(task) => task._id.toString() !== id
		);
		projectStored.tasks = tasks;
		await projectStored.save();
		const taskDeleted = await task.deleteOne();
		return res.json(taskDeleted);
	} catch (error) {
		console.log(error);
	}
};

/**
 * change state Task
 * @param {*} req receive id task
 * @param {*} res response for the client
 * @returns {status} 404 task not exists, 403 if not is creator and collaborator , 200 task state changed
 */
const changeStateTask = async (req, res) => {
	const { id } = req.params;

	let task;

	try {
		//populate is for get all information of ref someobject that is in someschema
		task = await Task.findById(id).populate('project');
	} catch (e) {
		const error = new Error("The task doesn't exist");
		return res.status(404).json({ msg: error.message });
	}

	try {
		if (
			task.project.creator.toString() !== req.user._id.toString() &&
			!task.project.collaborators.some(
				(collaborator) =>
					collaborator._id.toString() === req.user._id.toString()
			)
		) {
		}
	} catch (error) {
		const newError = new Error('Invalid action');
		return res.status(403).json({ msg: newError.message });
	}

	task.state = !task.state;
	task.completed = req.user._id;

	const taskStored = await task.save();

	return res.json({ taskStored, user: req.user });
};
// const getAllTask = async (req, res) => {};

export { getTask, newTask, changeStateTask, udpateTask, deleteTask };
