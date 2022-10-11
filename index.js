/**
 * Backend task manager
 * @file index.js is the main file
 * @author Carlos Muñoz
 */

// const express = require('express');
import express from 'express';
import dotenv from 'dotenv';
import connectionDB from './src/config/db.js';
import userRoutes from './src/routes/userRoutes.js';
import projectRoutes from './src/routes/projectRoutes.js';
import taskRoutes from './src/routes/taskRoutes.js';
import cors from 'cors';

//express
const app = express();

//Enviroment variables
dotenv.config();

//Config cors
const whiteList = [process.env.FRONTED_URL];

//cors dinamic
const corsOptions = {
	origin: function (origin, callback) {
		if (whiteList.includes(origin)) {
			//origin is domain from client
			//can request APi
			callback(null, true);
		} else {
			//cannot request
			callback(new Error('Error Cors'));
		}
	},
};
app.use(cors(corsOptions));

app.use(express.json()); //process json from client

//BD
connectionDB();

app.use('/api/users', userRoutes); //use support all verbos(get, post, delete, put)
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
	console.log(`server is running on port ${PORT}`);
});

// Sockets
import { Server } from 'socket.io';

const io = new Server(server, {
	pingTimeout: 60000,
	cors: {
		origin: process.env.FRONTED_URL,
	},
});

io.on('connection', (socket) => {
	// events
	socket.on('viewProject', (projectId) => {
		//receive project id

		socket.join(projectId); // create room
	});

	socket.on('newTask', (task) => {
		// receive notificaation that new task was added
		socket.to(task.project).emit('newTask', task);
	});
	socket.on('deleteTask', (task) => {
		// receive notificaation that a task was deleted
		socket.to(task.project._id).emit('deleteTask', task);
	});
	socket.on('updateTask', (task) => {
		// receive notificaation that a task was updated
		socket.to(task.project._id).emit('updateTask', task);
	});
	socket.on('changeStateTask', (task) => {
		const { project } = task.taskStored;
		// receive notificaation that  task was changed state
		socket.to(project._id).emit('changeStateTask', task);
	});
});
