# Project Setup Guide

This guide will help you set up the Student Portal project in VS Code, including installing all necessary dependencies.

## Prerequisites
-   **Node.js**: Ensure Node.js is installed (v16+ recommended).
-   **MySQL**: Ensure MySQL server is running and you have a database created.

---

## 1. Backend Setup (`project1` folder)

The backend is built with Node.js and Express.

### Dependencies
-   `express`: Web framework.
-   `mysql2`: MySQL client.
-   `cors`: Cross-Origin Resource Sharing.
-   `jsonwebtoken`: For authentication (JWT).
-   `crypto-js`: For password hashing.

### Installation
Open a terminal in VS Code and run:

```bash
cd project1
npm install
```

### Database Setup
1.  Open `project1/db/db.sql`.
2.  Run the SQL commands in your MySQL workbench or CLI to create the tables and insert initial data.
3.  Check `project1/db/pool.js` to ensure the database credentials (host, user, password, database) match your local setup.

### Running the Backend
```bash
npm start
# Server will run on http://localhost:4000
```

---

## 2. Frontend Setup (Root folder)

The frontend is built with React and Vite.

### Dependencies
-   `react`, `react-dom`: Core React libraries.
-   `react-router-dom`: For routing.
-   `axios`: For API requests.
-   `formik`, `yup`: For form handling and validation.
-   `tailwindcss`, `postcss`, `autoprefixer`: For styling.
-   `@heroicons/react`: For icons.
-   `clsx`, `tailwind-merge`: For utility class management.

### Installation
Open a **new** terminal (keep the backend running) and run:

```bash
# Ensure you are in the root directory (F1)
npm install
```

### Running the Frontend
```bash
npm run dev
# App will run on http://localhost:5173 (or similar)
```

---

## 3. VS Code Recommended Extensions
For the best development experience, install these extensions:
-   **ES7+ React/Redux/React-Native snippets**: For React snippets.
-   **Tailwind CSS IntelliSense**: For Tailwind class autocompletion.
-   **Prettier - Code formatter**: For code formatting.
-   **Thunder Client** (optional): For testing APIs directly in VS Code.

---

## Summary of Commands

**Backend Terminal:**
```bash
cd project1
npm install
npm start
```

**Frontend Terminal:**
```bash
npm install
npm run dev
```
