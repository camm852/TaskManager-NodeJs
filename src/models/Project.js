import mongoose from 'mongoose';

/**
 *
 * @typedef {Object} Project
 * @property {string} name project name
 * @property {string} description project description
 * @property {date} date project creation date
 * @property {string} customer project customer
 * @property {User} creator project creator type User
 * @property {User} collaborators project collaborators type User
 */

/**
 * @type {Project}
 */
const projectSchema = mongoose.Schema(
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
		datePicker: {
			type: Date,
			default: Date.now(),
		},
		customer: {
			type: String,
			trim: true,
			required: true,
		},
		creator: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
		collaborators: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
	},
	{
		timestamps: true,
	}
);

/*
  is for reference to user colection
      type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
*/

const Project = mongoose.model('Project', projectSchema);

export default Project;
