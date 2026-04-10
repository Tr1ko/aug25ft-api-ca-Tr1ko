var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

//routes import
const categoryRouter = require("./routes/category")
const todosRouter = require("./routes/todos")
var usersRouter = require('./routes/users');

//swagger options 
const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Todo API',
			version: '1.0.0',
		},
	},
	apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsDoc(options);

//db sync
require('dotenv').config();
var db = require('./models');
if (process.env.NODE_ENV !== 'test') {
	db.sequelize.sync().then(async () => {
		const statuses = ['Not Started', 'Started', 'Completed', 'Deleted'];

		for (const s of statuses) {
			await db.Status.findOrCreate({
				where: { status: s },
			});
		}

		console.log('Database synced');
	});
}

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use("/todos", todosRouter);
app.use("/category", categoryRouter);
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;

