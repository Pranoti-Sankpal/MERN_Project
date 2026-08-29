# Project Documentation: Student Portal & Admin Panel

## 1. Project Overview
This project is a full-stack web application designed for managing online courses. It consists of a **Student Portal** for users to browse and watch courses, and an **Admin Panel** for administrators to manage courses, students, and videos.

### Tech Stack
-   **Frontend**: React (Vite), Tailwind CSS, React Router, Axios, Formik, Yup.
-   **Backend**: Node.js, Express.js.
-   **Database**: MySQL.
-   **Authentication**: JWT (JSON Web Tokens).

---

## 2. Project Structure

```
F1/
├── project1/                 # Backend Code
│   ├── db/
│   │   └── pool.js           # Database connection pool
│   │   └── db.sql            # Database schema
│   ├── routers/
│   │   ├── admin.js          # Admin API routes (Courses, Students)
│   │   ├── auth.js           # Auth API routes (Login, Register)
│   │   ├── student.js        # Student API routes (My Courses, Videos)
│   │   └── videos.js         # Video Management API routes
│   ├── utils/
│   │   ├── auth.js           # Auth Middleware (authUser, checkAuthorization)
│   │   └── result.js         # API response helper
│   └── server.js             # Main Express server entry point
│
├── src/                      # Frontend Code
│   ├── api/
│   │   └── client.js         # Axios instance with interceptors
│   ├── components/
│   │   ├── courses/          # Course-related components (Card, Form, Table)
│   │   └── layout/           # Layout components (Navbar, ProtectedRoute)
│   ├── context/
│   │   └── AuthContext.jsx   # Authentication state management
│   ├── pages/
│   │   ├── admin/            # Admin pages (Dashboard, Courses, Students, Videos)
│   │   ├── Home.jsx          # Public Home page
│   │   ├── Login.jsx         # Login page
│   │   ├── Register.jsx      # Registration page
│   │   ├── MyCourses.jsx     # Student's enrolled courses
│   │   ├── VideoPlayer.jsx   # Video player page
│   │   └── ChangePassword.jsx# Change Password page
│   ├── App.jsx               # Main React component & Routing
│   └── main.jsx              # React entry point
└── ...config files
```

---

## 3. Database Schema

The project uses a MySQL database with the following tables:

1.  **`users`**: Stores user credentials and roles.
    -   `id`, `name`, `email`, `password` (hashed), `role` ('admin' or 'student').
2.  **`courses`**: Stores course details.
    -   `course_id`, `course_name`, `description`, `fees`, `start_date`, `end_date`, `video_expire_days`.
3.  **`students`**: Stores student profiles (linked to users).
    -   `reg_no`, `name`, `email`, `mobile_no`, `course_id` (Foreign Key).
4.  **`videos`**: Stores video content for courses.
    -   `video_id`, `title`, `description`, `youtube_url`, `course_id` (Foreign Key).

---

## 4. Application Flow & Features

### Public Access
-   **Home Page (`/`)**: Displays all **Active Courses** (courses that have not ended).
    -   *Logic*: Fetches from `/student/all-courses` which filters `WHERE end_date >= CURDATE()`.
-   **About Page (`/about`)**: Static information page.

### Student Features
-   **Registration (`/register`)**: New students can sign up.
    -   *Flow*: User enters details -> Backend creates entry in `users` and `students` tables.
-   **Login (`/login`)**: Access to personal dashboard.
    -   *Flow*: Returns a JWT token -> Stored in `localStorage` -> Used for subsequent requests.
-   **My Courses (`/my-courses`)**: View enrolled courses.
-   **Watch Videos**: Access course videos via the video player.
-   **Change Password**: Securely update account password.

### Admin Features (Protected)
-   **Dashboard (`/dashboard`)**: Overview and quick links.
-   **Course Management**:
    -   **Add Course**: Create new courses.
    -   **Edit/Delete Course**: Modify or remove existing courses.
-   **Student Management**:
    -   **Filter by Course**: View students enrolled in specific courses.
-   **Video Management**:
    -   **CRUD**: Add, update, delete videos for specific courses.

---

## 5. Key Code Explanation

### Backend (`project1/`)

#### `server.js`
The entry point. Sets up CORS, JSON parsing, and mounts routers.
```javascript
app.use("/admin", authUser, adminRouter) // Protected Admin Routes
app.use("/student", studentRouter)       // Public/Student Routes
```

#### `routers/student.js`
Handles student-facing functionality.
-   **`GET /all-courses`**: Public endpoint. Returns courses where `end_date >= CURDATE()`.
-   **`PUT /change-password`**: Updates user password.

#### `routers/admin.js`
Handles admin functionality.
-   **`POST /addCourse`**: Inserts new course into DB.
-   **`GET /enrolled-students`**: Joins `students` and `courses` tables.

#### `utils/auth.js`
Middleware for security.
-   **`authUser`**: Verifies JWT token from headers.
-   **`checkAuthorization`**: Ensures user has 'admin' role.

### Frontend (`src/`)

#### `api/client.js`
Axios instance configuration. Automatically attaches the token to requests.
```javascript
client.interceptors.request.use(config => {
    const token = localStorage.getItem('admin-token') // or student token
    if (token) config.headers['token'] = token
    return config
})
```

#### `context/AuthContext.jsx`
Manages global auth state (`user`, `login`, `logout`).
-   **`login`**: Calls API, saves token, sets user state.
-   **`logout`**: Clears token and state.

#### `components/layout/ProtectedRoute.jsx`
Wrapper component to restrict access.
-   Checks if `user` exists.
-   If `adminOnly` prop is true, checks if `user.role === 'admin'`.
-   Redirects to `/login` if unauthorized.

#### `pages/Home.jsx`
Fetches and displays active courses.
```javascript
// Fetches from the public API
const response = await client.get('/student/all-courses')
```

---

## 6. How to Run

1.  **Start Backend**:
    ```bash
    cd project1
    npm start
    # Runs on port 4000
    ```

2.  **Start Frontend**:
    ```bash
    # In root directory
    npm run dev
    # Runs on port 5173
    ```
