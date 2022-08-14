/**
 * Project routes
 * @module
 */

import express, { application } from 'express';
import {
	getProjects,
	newProject,
	getProject,
	editProject,
	deleteProject,
	searchCollaborator,
	addCollaborator,
	deleteCollaborator,
} from '../controllers/projectController.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

/**
 * get for get projects and post for new project
 * @name getProjects-newProjects
 * @path {get-post} /api/projects/
 */
router.route('/').get(checkAuth, getProjects).post(checkAuth, newProject);

/**
 * get unique project - edit project - delete project
 * @name getProject-editProject-deleteProject
 * @path {get-put-delet} /api/projects/:id
 */
router
	.route('/:id')
	.get(checkAuth, getProject)
	.put(checkAuth, editProject)
	.delete(checkAuth, deleteProject);

/**
 * delete project's collaborator
 * @name add-Collaborator
 * @path {post}  /api/projects/collaborators/:id
 */
router.post('/collaborators/:id', checkAuth, addCollaborator);

/**
 * delete project's collaborator
 * @name search-Collaborator
 * @path {post}  /api/projects/collaborators
 */
router.post('/collaborators', checkAuth, searchCollaborator);

/**
 * delete project's collaborator
 * @name deleteCollaborator
 * @path {post}  /api/projects/delete-collaborator/:id
 */
router.post('/delete-collaborator/:id', checkAuth, deleteCollaborator);

export default router;
