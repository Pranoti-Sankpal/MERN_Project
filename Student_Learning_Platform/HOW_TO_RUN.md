# How to Run and Test the Application

## Prerequisites
1. Make sure MySQL is running
2. Database `learning_platform` should be created (run `project1/db/db.sql` if not already done)
3. Node.js and npm should be installed

## Step 1: Start the Backend Server

Open a terminal and navigate to the `project1` folder:

```bash
cd project1
npm start
```

You should see:
```
Server running at port 4000
```

**Keep this terminal open** - the backend server needs to keep running.

## Step 2: Start the Frontend Server

Open a **NEW terminal** (keep the backend terminal running) and navigate to the root folder:

```bash
npm run dev
```

You should see something like:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Step 3: Access the Application

1. Open your browser and go to: **http://localhost:5173** (or the port shown in your terminal)

2. You'll see the home page with all available courses

3. Click **"View More"** on any course card

4. You'll see the Course Detail page with:
   - Course information (name, dates, fees)
   - **Course Description** (this is the new feature we added!)
   - Registration form on the right side

5. Fill in the registration form:
   - Full Name
   - Email
   - Mobile Number (10 digits)
   - Click **"Register to Course"**

6. On successful registration:
   - You'll see a success message
   - You'll be redirected to "My Courses" page after 2 seconds

## Testing the Duplicate Registration Check

1. Try registering the same email to the same course twice
2. You should see an error message: "You are already registered to this course"

## Important Notes

- **Backend must run on port 4000** (default)
- **Frontend runs on port 5173** (or whatever Vite assigns)
- Both servers must be running simultaneously
- Make sure your MySQL database credentials in `project1/db/pool.js` match your setup

## Troubleshooting

If you get connection errors:
1. Check if MySQL is running
2. Verify database credentials in `project1/db/pool.js`
3. Make sure the database `learning_platform` exists
4. Check that both servers are running (backend on 4000, frontend on 5173)

