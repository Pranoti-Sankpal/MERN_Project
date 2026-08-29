import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import CourseDetail from './pages/CourseDetail'
import MyCourses from './pages/MyCourses'
import VideoPlayer from './pages/VideoPlayer'
import About from './pages/About'
import ChangePassword from './pages/ChangePassword'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Dashboard from './pages/admin/Dashboard'
import Courses from './pages/admin/Courses'
import CourseFormPage from './pages/admin/CourseFormPage'
import Students from './pages/admin/Students'
import Videos from './pages/admin/Videos'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/courses/:id" element={<CourseDetail />} />
      <Route path="/about" element={<About />} />
      <Route
        path="/my-courses"
        element={
          <ProtectedRoute>
            <MyCourses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/course/:id/video"
        element={
          <ProtectedRoute>
            <VideoPlayer />
          </ProtectedRoute>
        }
      />
      <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/dashboard" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
      <Route path="/courses" element={<ProtectedRoute adminOnly><Courses /></ProtectedRoute>} />
      <Route path="/courses/add" element={<ProtectedRoute adminOnly><CourseFormPage /></ProtectedRoute>} />
      <Route path="/courses/edit/:id" element={<ProtectedRoute adminOnly><CourseFormPage /></ProtectedRoute>} />
      <Route path="/students" element={<ProtectedRoute adminOnly><Students /></ProtectedRoute>} />
      <Route path="/videos" element={<ProtectedRoute adminOnly><Videos /></ProtectedRoute>} />
    </Routes>
  )
}

export default App
