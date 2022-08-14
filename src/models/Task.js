import mongoose from 'mongoose';

/**
 * @typedef {Object} Task
 * @property {string} name name task
 * @property {string} description description task's
 * @property {boolean} state if is completed or not completed
 * @property {date} deliveryDate date to delivery
 * @property {string} priority priority task's
 * @property {string} description description task's
 * @property {Project} Project project  to which it belongs
 * @property {User} User if the task is comleted and who completed it
 */

/**
 * @type {Task}
 */
const taskScheema = mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: true,
		},
		description: {
			type: String,
			trim: true,
			required: true,
		},
		state: {
			type: Boolean,
			default: false,
		},
		deliveryDate: {
			type: Date,
			required: true,
			default: Date.now(),
		},
		priority: {
			type: String,
			required: true,
			enum: ['Low', 'Mid', 'High'],
		},
		project: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Project',
		},
		completed: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{
		timstamps: true,
	}
);

const Task = mongoose.model('Task', taskScheema);
export default Task;
