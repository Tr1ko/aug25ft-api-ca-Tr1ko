var express = require('express');
var router = express.Router();
const isAuth = require('../middleware/middleware');
const db = require("../models");
require("dotenv").config();

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Get all todos (excluding deleted)
 *     description: Returns all todos for logged in user except those marked as deleted
 *     responses:
 *       200:
 *         description: List of todos
 *       401:
 *         description: Unauthorized
 */
router.get('/', isAuth, async (req, res) => {
	const todos = await db.Todo.findAll({
		where: { UserId: req.user.id },
		include: [db.Category, db.Status],
	});

	const filtered = todos.filter(t => t.Status.status !== 'Deleted');

	res.json(filtered);
});

/**
 * @swagger
 * /todos/all:
 *   get:
 *     summary: Get all todos including deleted
 *     responses:
 *       200:
 *         description: List of all todos
 */
router.get('/all', isAuth, async (req, res) => {
	const todos = await db.Todo.findAll({
		where: { UserId: req.user.id },
		include: [db.Category, db.Status],
	});

	res.json(todos);
});

/**
 * @swagger
 * /todos/deleted:
 *   get:
 *     summary: Get all deleted todos
 *     responses:
 *       200:
 *         description: List of deleted todos
 */
router.get('/deleted', isAuth, async (req, res) => {
	const deletedStatus = await db.Status.findOne({
		where: { status: 'Deleted' },
	});

	const todos = await db.Todo.findAll({
		where: {
			UserId: req.user.id,
			StatusId: deletedStatus.id,
		},
		include: [db.Category, db.Status],
	});

	res.json(todos);
});

/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Create a new todo
 *     description: Creates a todo for the logged in user with default status "Not Started"
 *     responses:
 *       200:
 *         description: Todo created
 */
router.post('/', isAuth, async (req, res) => {
	const { name, description, CategoryId } = req.body;

	const status = await db.Status.findOne({
		where: { status: 'Not Started' },
	});

	const todo = await db.Todo.create({
		name,
		description,
		CategoryId,
		StatusId: status.id,
		UserId: req.user.id,
	});

	res.json(todo);
});

/**
 * @swagger
 * /todos/statuses:
 *   get:
 *     summary: Get all statuses
 *     responses:
 *       200:
 *         description: List of statuses
 */
router.get('/statuses', async (req, res) => {
	const statuses = await db.Status.findAll();
	res.json(statuses);
});

/**
 * @swagger
 * /todos/{id}:
 *   put:
 *     summary: Update a todo
 *     description: Update a specific todo for the logged in user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: Updated todo
 *       404:
 *         description: Todo not found
 */
router.put('/:id', isAuth, async (req, res) => {
	const todo = await db.Todo.findOne({
		where: { id: req.params.id, UserId: req.user.id },
	});

	if (!todo) return res.status(404).send('Not found');

	await todo.update(req.body);

	res.json(todo);
});

/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Delete a todo (soft delete)
 *     description: Sets todo status to "Deleted"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: Todo deleted
 *       404:
 *         description: Todo not found
 */
router.delete('/:id', isAuth, async (req, res) => {
	
	const deletedStatus = await db.Status.findOne({
		where: { status: 'Deleted' },
	});

	const todo = await db.Todo.findOne({
		where: { id: req.params.id, UserId: req.user.id },
	});

	if (!todo) return res.status(404).send('Not found');

	await todo.update({ StatusId: deletedStatus.id });

	res.json({ message: 'Deleted (soft)' });
});

module.exports = router;