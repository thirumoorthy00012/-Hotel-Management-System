# Hotel Management System

A full-stack Hotel Management System built using **React, Node.js, Express, and PostgreSQL**.

## Features

* Add, view, edit, and delete hotels
* Hotel image upload
* Search and filtering
* Pagination
* REST API integration
* PostgreSQL database

## Tech Stack

**Frontend**

* React.js
* JavaScript
* CSS
* Redux

**Backend**

* Node.js
* Express.js
* REST API

**Database**

* PostgreSQL

**Tools**

* Git & GitHub
* Postman
* VS Code

## Project Structure

```text
Hotel Management System/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── uploads/
│   └── server.js
├── frontend/
│   └── src/
├── postman/
├── .gitignore
├── package.json
└── README.md
```

## How to Run

### 1. Clone the repository

```bash
git clone https://github.com/thirumoorthy00012/-Hotel-Management-System.git
```

### 2. Install dependencies

```bash
npm install
```

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd ../frontend
npm install
```

### 3. Configure PostgreSQL

Create a PostgreSQL database and add your database details to a `.env` file.

```text
DB_USER=your_database_user
DB_HOST=localhost
DB_NAME=your_database_name
DB_PASSWORD=your_database_password
DB_PORT=5432
```

**Do not upload `.env` to GitHub.**

### 4. Run the application

Backend:

```bash
cd backend
node server.js
```

Frontend:

```bash
cd frontend
npm run dev
```

## API Testing

The REST APIs can be tested using **Postman**.

## Project Purpose

This project demonstrates full-stack development using React, Node.js, Express, PostgreSQL, REST APIs, CRUD operations, image uploads, search, filtering, and pagination.

## Author

**Thiru Moorthy**
