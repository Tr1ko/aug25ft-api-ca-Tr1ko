const request = require('supertest');
const app = require('../app'); // your app.js
const db = require('../models');
process.env.NODE_ENV = 'test';

let token;
let todoId;

beforeAll(async () => {
	// Reset DB before tests
	await db.sequelize.sync({ force: true });

	// Seed statuses
	const statuses = ['Not Started', 'Started', 'Completed', 'Deleted'];
	for (const s of statuses) {
		await db.Status.create({ status: s });
	}

	// Create user
	await request(app).post('/users/signup').send({
		name: 'Test User',
		email: 'test@test.com',
		password: '1234',
	});

	// Login to get token
	const res = await request(app).post('/users/login').send({
		email: 'test@test.com',
		password: '1234',
	});

	token = res.body.data.token;

	// Create category
	await request(app)
		.post('/category')
		.set('Authorization', `Bearer ${token}`)
		.send({ name: 'Test Category' });
});

afterAll(async () => {
	await db.sequelize.close();
});


// ✅ 1. Login test
test('Login with valid account', async () => {
	const res = await request(app).post('/users/login').send({
		email: 'test@test.com',
		password: '1234',
	});

	expect(res.statusCode).toBe(200);
	expect(res.body.data.token).toBeDefined();
});


// ✅ 2. Get todos with token
test('Get todos with valid token', async () => {
	const res = await request(app)
		.get('/todos')
		.set('Authorization', `Bearer ${token}`);

	expect(res.statusCode).toBe(200);
});


// ✅ 3. Create todo
test('Create a new todo', async () => {
	const res = await request(app)
		.post('/todos')
		.set('Authorization', `Bearer ${token}`)
		.send({
			name: 'Test Todo',
			description: 'Testing',
			CategoryId: 1,
		});

	expect(res.statusCode).toBe(200);
	expect(res.body.name).toBe('Test Todo');

	todoId = res.body.id;
});


// ✅ 4. Delete todo
test('Delete a todo (soft delete)', async () => {
	const res = await request(app)
		.delete(`/todos/${todoId}`)
		.set('Authorization', `Bearer ${token}`);

	expect(res.statusCode).toBe(200);
});


// ❌ 5. Get todos without token
test('Get todos without token should fail', async () => {
	const res = await request(app).get('/todos');

	expect(res.statusCode).toBe(401);
});


// ❌ 6. Get todos with invalid token
test('Get todos with invalid token should fail', async () => {
	const res = await request(app)
		.get('/todos')
		.set('Authorization', 'Bearer invalidtoken');

	expect(res.statusCode).toBe(401);
});