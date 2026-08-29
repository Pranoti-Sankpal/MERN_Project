import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
    const { user, logout } = useAuth()

    return (
        <header className="bg-sky-400 text-white shadow-sm">
            <div className="w-full px-4 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-8">
                    <Link to="/" className="text-xl font-bold">Student Portal</Link>
                    <nav className="hidden md:flex space-x-4 font-medium">
                        <NavLink to="/" className={({ isActive }) => isActive ? "opacity-100" : "opacity-90 hover:opacity-100"}>Home</NavLink>
                        <NavLink to="/about" className={({ isActive }) => isActive ? "opacity-100" : "opacity-90 hover:opacity-100"}>About</NavLink>
                        <NavLink to="/my-courses" className={({ isActive }) => isActive ? "opacity-100" : "opacity-90 hover:opacity-100"}>My Courses</NavLink>
                    </nav>
                </div>
                <div>
                    {user ? (
                        <div className="flex items-center space-x-4">
                            <span className="text-white font-medium">Hello, {user.name}</span>
                            <Link to="/change-password" className="text-white/90 hover:text-white text-sm font-medium hover:underline">
                                Change Password
                            </Link>
                            <button
                                onClick={logout}
                                className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded transition text-sm font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="space-x-2">
                            <Link to="/login" className="px-4 py-1.5 bg-white text-sky-600 rounded font-medium hover:bg-sky-50 transition">Login</Link>
                            <Link to="/register" className="px-4 py-1.5 bg-sky-600 text-white rounded font-medium hover:bg-sky-700 transition">Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Navbar
