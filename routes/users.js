var express = require('express');
var router = express.Router();
var jsend = require('jsend');
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const db = require("../models");

router.use(jsend.middleware);
require("dotenv").config();

// hash password function
function hashPassword(password, salt) {
	return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512');
}

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login user
 *     description: Authenticate user and return JWT token
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', async (req, res) => {
	const { email, password } = req.body;

	const user = await db.User.findOne({ where: { email } });

	if (!user) {
		return res.jsend.fail({ message: "User not found" });
	}

	const hashed = hashPassword(password, user.salt);

	// ✅ FIXED password check
	if (!hashed.equals(user.encryptedPassword)) {
		return res.jsend.fail({ message: "Wrong password" });
	}

	const token = jwt.sign(
		{ id: user.id },
		process.env.JWT_SECRET,
		{ expiresIn: '1h' }
	);

	res.jsend.success({ token });
});

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account
 *     responses:
 *       200:
 *         description: User created
 */
router.post('/signup', async (req, res) => {
	const { name, email, password } = req.body;

	const salt = crypto.randomBytes(16);
	const encryptedPassword = hashPassword(password, salt);

	const user = await db.User.create({
		name,
		email,
		encryptedPassword,
		salt,
	});

	res.jsend.success({ user });
});

/**
 * @swagger
 * /users/fail:
 *   get:
 *     summary: Example failure route
 *     responses:
 *       401:
 *         description: Unauthorized
 */
router.get('/fail', (req, res) => {
	return res.status(401).jsend.error({
		statusCode: 401,
		message: 'message',
		data: 'data'
	});
});

module.exports = router;