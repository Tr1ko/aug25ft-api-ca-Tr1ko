# 📝 Todo API

This is a REST API built with Express.js and Sequelize connected to a MySQL database.  
The API allows users to register, log in, and manage their own todos.

---

# 🚀 Features

- User registration and login
- JWT authentication
- Create, update, and delete todos
- Soft delete (todos are marked as "Deleted" instead of removed)
- Categories for organizing todos
- Status system (Not Started, Started, Completed, Deleted)
- Swagger API documentation
- Jest + Supertest testing

---

# 🛠 Tech Stack

- Node.js
- Express.js
- MySQL
- Sequelize ORM
- JWT (Authentication)
- Swagger (API documentation)
- Jest & Supertest (Testing)

---

# 🔐 Authentication

The API uses JWT authentication.

- Users must sign up and log in to receive a token
- The token must be included in protected routes:
Authorization: Bearer <token>
---

# 📦 Installation

1. Clone the repository:


git clone <your-repo-url>
cd <your-project-folder>


2. Install dependencies:


npm install


3. Create a `.env` file:


DATABASE_NAME=myTodo
ADMIN_USERNAME=your_mysql_username
ADMIN_PASSWORD=your_mysql_password
HOST=localhost
DIALECT=mysql
JWT_SECRET=your_secret_key


4. Start the server:


npm start


---

# 🗄 Database

- The database is called **myTodo**
- Sequelize automatically creates tables on startup
- Status values are seeded automatically:
  - Not Started
  - Started
  - Completed
  - Deleted

---

# 📚 API Documentation

Swagger documentation is available at:


http://localhost:3000/doc


---

# 📌 API Endpoints

## 👤 Users
- POST `/users/signup` → Register user
- POST `/users/login` → Login and get JWT

## 📝 Todos
- GET `/todos` → Get all active todos
- GET `/todos/all` → Get all todos (including deleted)
- GET `/todos/deleted` → Get deleted todos
- POST `/todos` → Create todo
- PUT `/todos/:id` → Update todo
- DELETE `/todos/:id` → Soft delete todo

## 📂 Categories
- GET `/category` → Get all categories
- POST `/category` → Create category
- PUT `/category/:id` → Update category
- DELETE `/category/:id` → Delete category

## 📊 Status
- GET `/todos/statuses` → Get all statuses

---

# 🧪 Testing

Run tests using:


npm test


Tests include:
- Login with valid account
- Access protected routes with JWT
- Create and delete todos
- Unauthorized access handling

---

# 🧠 Design Decisions

- **JWT Authentication**: Secures all routes except login and signup
- **Soft Delete**: Todos are not removed from the database but marked as "Deleted"
- **User Isolation**: Users can only access their own data
- **Relational Database**:
  - Todos belong to users, categories, and statuses

---

# 👨‍💻 Author

Trym Solheim