var express = require('express');
var router = express.Router();
const isAuth = require('../middleware/middleware');
const db = require('../models');

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Get all categories
 *     description: Returns all categories for the logged in user
 *     responses:
 *       200:
 *         description: List of categories
 *       401:
 *         description: Unauthorized
 */
router.get('/', isAuth, async (req, res) => {
	const categories = await db.Category.findAll({
		where: { UserId: req.user.id },
	});
	res.json(categories);
});

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Create a new category
 *     description: Creates a category for the logged in user
 *     responses:
 *       200:
 *         description: Category created
 */
router.post('/', isAuth, async (req, res) => {
	const { name } = req.body;

	const category = await db.Category.create({
		name,
		UserId: req.user.id,
	});

	res.json(category);
});

/**
 * @swagger
 * /category/{id}:
 *   put:
 *     summary: Update a category
 *     description: Updates a specific category for the logged in user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category updated
 *       404:
 *         description: Category not found
 */
router.put('/:id', isAuth, async (req, res) => {
	const category = await db.Category.findOne({
		where: { id: req.params.id, UserId: req.user.id },
	});

	if (!category) return res.status(404).send('Not found');

	await category.update(req.body);

	res.json(category);
});

/**
 * @swagger
 * /category/{id}:
 *   delete:
 *     summary: Delete a category
 *     description: Deletes a category for the logged in user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted
 *       404:
 *         description: Category not found
 */
router.delete('/:id', isAuth, async (req, res) => {
	const category = await db.Category.findOne({
		where: { id: req.params.id, UserId: req.user.id },
	});

	if (!category) return res.status(404).send('Not found');

	await category.destroy();

	res.json({ message: 'Category deleted' });
});

module.exports = router;