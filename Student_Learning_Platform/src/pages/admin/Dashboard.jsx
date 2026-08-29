import AdminLayout from '../../components/layout/AdminLayout'

const Dashboard = () => {
    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-lg transition cursor-pointer" onClick={() => window.location.href = '/courses'}>
                    <h2 className="text-xl font-bold mb-2 text-blue-600">Courses</h2>
                    <p className="text-gray-600">Manage all courses. Add, update or delete courses.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-lg transition cursor-pointer" onClick={() => window.location.href = '/students'}>
                    <h2 className="text-xl font-bold mb-2 text-green-600">Students</h2>
                    <p className="text-gray-600">View enrolled students per course.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-lg transition cursor-pointer" onClick={() => window.location.href = '/videos'}>
                    <h2 className="text-xl font-bold mb-2 text-red-600">Videos</h2>
                    <p className="text-gray-600">Manage course videos.</p>
                </div>
            </div>
        </AdminLayout>
    )
}

export default Dashboard
