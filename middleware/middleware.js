// Middleware function to determine if the API endpoint request is from an authenticated user
const jwt = require("jsonwebtoken");
require("dotenv").config();


function isAuth(req, res, next) {
	const authHeader = req.headers.authorization;

	if(!authHeader) {
		return res.status(401).send('no token');
	}

	try {
		const token = authHeader.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET)

		req.user = decoded;

		next();
	} catch (err) {
		return res.status(401).send("invalid token")
	}
}

module.exports = isAuth;

