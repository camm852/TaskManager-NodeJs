/**
 *
 * @module project-controller
 */

import Project from '../models/Project.js';
import Task from '../models/Task.js';
import User from '../models/Users.js';

/**
 * get all projects
 * @param {*} req
 * @param {*} res response all projects where you are collaborator o creator
 * @returns {status} return all projects by user id in session
 */
const getProjects = async (req, res) => {
	const projects = await Project.find({
		$or: [{ collaborators: { $in: req.user } }, { creator: { $in: req.user } }],
	}).select('-tasks');
	res.json(projects);
};

/**
 * create new project
 * @param {Project} req receive object type project withouth collaborators and taks
 * @param {*} res response for the client
 * @returns {status} create new project
 */
const newProject = async (req, res) => {
	const project = new Project(req.body);
	project.creator = req.user._id;

	try {
		const projectStored = await project.save();
		res.json(projectStored);
	} catch (error) {
		res.status(404).json({ msg: 'AN ERROR HAS OCCURED' });
	}
};

/**
 * get specific project
 * @param {string} req id project
 * @param {*} res response for the client
 * @returns {status} 404 if not exist project, 403 if some try get project if not is collaborator or creator, 200 specific project by id
 */
const getProject = async (req, res) => {
	const { id } = req.params;
	let project;
	try {
		project = await Project.findById(id)
			.populate({
				path: 'tasks',
				populate: { path: 'completed', select: 'name' },
			})
			.populate('collaborators', 'name email');
	} catch (error) {
		project = null;
	}
	if (!project) {
		const error = new Error('Project not found');
		return res.status(404).json({ msg: error.message });
	}
	if (
		project.creator.toString() !== req.user._id.toString() &&
		!project.collaborators.some(
			(collaborator) => collaborator._id.toString() === req.user._id.toString()
		)
	) {
		const error = new Error('Action invalid');
		return res.status(403).json({ msg: error.message });
	}
	const task = await Task.find().where('project').equals(id);
	res.json({
		project,
		// task,
	});
};

/**
 * edit spcific project
 * @param {string} req id project
 * @param {*} res response for the client
 * @returns {status} 404 if not exist project, 403 if the project is not our, 200 edit project
 */
const editProject = async (req, res) => {
	const { id } = req.params;
	let project;
	try {
		project = await Project.findById(id);
	} catch (error) {
		project = null;
	}
	if (!project) {
		const error = new Error('Project not found');
		return res.status(404).json({ msg: error.message });
	}
	if (project.creator.toString() !== req.user._id.toString()) {
		const error = new Error('Action invalid');
		return res.status(403).json({ msg: error.message });
	}

	project.name = req.body.name || project.name;
	project.description = req.body.description || project.description;
	project.datePicker = req.body.datePicker || project.datePicker;
	project.customer = req.body.customer || project.customer;

	await project.save();
	res.json(project);
};

/**
 * delete specific project
 * @param {string} req id project
 * @param {*} res response for the client
 * @returns {status} 404 if not exist project, 403 if the project is not our, 500 if fail try delete, 200 delete specific project
 */
const deleteProject = async (req, res) => {
	const { id } = req.params;
	let project;
	try {
		project = await Project.findById(id);
	} catch (error) {
		project = null;
	}
	if (!project) {
		const error = new Error('Project not found');
		return res.status(404).json({ msg: error.message });
	}
	if (project.creator.toString() !== req.user._id.toString()) {
		const error = new Error('Action invalid');
		return res.status(403).json({ msg: error.message });
	}

	try {
		const projectDelete = await project.deleteOne();
		// return res.json({ msg: 'Project deleted' });
		return res.status(402).json(projectDelete);
	} catch (error) {
		return res.status(500).json({ msg: 'Failed to delete' });
	}
};

/**
 * searc collaborator
 * @param {*} req email collaborator
 * @param {*} res 404 user not found, 404 if try search yourself, 200 user found
 * @returns {status}
 */
const searchCollaborator = async (req, res) => {
	const { email } = req.body;
	let userStored;
	try {
		userStored = await User.findOne({ email }).select(
			'-confirm -createdAt -password -token -updatedAt -__v'
		);
	} catch (error) {
		userStored = null;
	}
	if (!userStored) {
		const error = new Error('User not found');
		return res.status(404).json({ msg: error.message });
	}
	if (userStored.email === req.user.email) {
		const error = new Error('You can not add yourself');
		return res.status(404).json({ msg: error.message });
	}
	return res.json(userStored);
};

/**
 * add collaborator
 * @param {*} req id project, email collaborator
 * @param {*} res 404 project not found or try add yourself or already is collaborator, 404 if not is the creator, 200 collaborator added
 * @returns {status}
 */
const addCollaborator = async (req, res) => {
	let projectStored;
	try {
		projectStored = await Project.findById(req.params.id);
	} catch (error) {
		projectStored = null;
	}
	if (!projectStored) {
		const error = new Error('Project not found');
		return res.status(404).json({ msg: error.message });
	}
	if (projectStored.creator.toString() !== req.user._id.toString()) {
		const error = new Error('Action invalid');
		return res.status(404).json({ msg: error.message });
	}

	const { email } = req.body;
	let userStored;
	try {
		userStored = await User.findOne({ email }).select(
			'-confirm -createdAt -password -token -updatedAt -__v'
		);
	} catch (error) {
		userStored = null;
	}

	if (userStored.email === req.user.email) {
		const error = new Error('You can not add yourself');
		return res.status(404).json({ msg: error.message });
	}

	//Collaborator exists?
	if (projectStored.collaborators.includes(userStored._id)) {
		const error = new Error('User already is collaborator');
		return res.status(404).json({ msg: error.message });
	}

	projectStored.collaborators.push(userStored._id);

	await projectStored.save();
	return res.json(userStored);
};

/**
 * delete collaborator
 * @param {*} req id project
 * @param {*} res 404 project not found or if not is creator, 200 id collaborator
 * @returns {status}
 */
const deleteCollaborator = async (req, res) => {
	let projectStored;
	try {
		projectStored = await Project.findById(req.params.id);
	} catch (error) {
		projectStored = null;
	}

	if (!projectStored) {
		const error = new Error('Project not found');
		return res.status(404).json({ msg: error.message });
	}

	if (projectStored.creator.toString() !== req.user._id.toString()) {
		const error = new Error('Action invalid');
		return res.status(404).json({ msg: error.message });
	}

	const newCollaborators = projectStored.collaborators.filter(
		(collaborator) =>
			collaborator._id.toString() !== req.body.idCollaborator.toString()
	);
	projectStored.collaborators = newCollaborators;
	await projectStored.save();
	res.json({ _id: req.body.idCollaborator });
};

export {
	getProjects,
	newProject,
	getProject,
	editProject,
	deleteProject,
	searchCollaborator,
	addCollaborator,
	deleteCollaborator,
};
