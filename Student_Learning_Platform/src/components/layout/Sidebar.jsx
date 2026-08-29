import { NavLink } from 'react-router-dom'

const Sidebar = () => {
    return (
        <aside className="w-64 bg-white shadow-md min-h-screen fixed top-0 bottom-0 left-0 pt-16 z-0 hidden lg:block border-r border-gray-200">
            <nav className="p-4 mt-4">
                <ul className="space-y-2">
                    <li>
                        <NavLink
                            to="/"
                            className={({ isActive }) => `block px-4 py-2 rounded transition ${isActive ? 'bg-sky-100 text-sky-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/about"
                            className={({ isActive }) => `block px-4 py-2 rounded transition ${isActive ? 'bg-sky-100 text-sky-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            About
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/my-courses"
                            className={({ isActive }) => `block px-4 py-2 rounded transition ${isActive ? 'bg-sky-100 text-sky-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            My Courses
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </aside>
    )
}

export default Sidebar
