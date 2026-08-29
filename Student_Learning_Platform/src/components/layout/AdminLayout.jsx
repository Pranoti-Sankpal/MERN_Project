import AdminNavbar from './AdminNavbar'

const AdminLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <AdminNavbar />
            <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
                {children}
            </div>
        </div>
    )
}

export default AdminLayout
