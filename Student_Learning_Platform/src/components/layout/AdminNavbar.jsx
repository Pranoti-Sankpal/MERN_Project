import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const AdminNavbar = () => {
    const { logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav className="bg-blue-600 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <span className="font-bold text-xl">Learning Platform Admin</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <NavLink to="/dashboard" className={({ isActive }) => `px-3 py-2 rounded hover:bg-blue-700 ${isActive ? 'bg-blue-700' : ''}`}>Dashboard</NavLink>
                        <NavLink to="/courses" className={({ isActive }) => `px-3 py-2 rounded hover:bg-blue-700 ${isActive ? 'bg-blue-700' : ''}`}>Courses</NavLink>
                        <NavLink to="/videos" className={({ isActive }) => `px-3 py-2 rounded hover:bg-blue-700 ${isActive ? 'bg-blue-700' : ''}`}>Videos</NavLink>
                        <NavLink to="/students" className={({ isActive }) => `px-3 py-2 rounded hover:bg-blue-700 ${isActive ? 'bg-blue-700' : ''}`}>Students</NavLink>
                        <button onClick={handleLogout} className="px-3 py-2 rounded hover:bg-blue-700 border border-white/20">Logout</button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default AdminNavbar
