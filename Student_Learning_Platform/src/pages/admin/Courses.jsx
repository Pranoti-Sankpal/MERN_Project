import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import CourseTable from '../../components/courses/CourseTable'

const Courses = () => {
    const navigate = useNavigate()

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">All Courses</h1>
                <button
                    onClick={() => navigate('/courses/add')}
                    className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
                >
                    + Add New Course
                </button>
            </div>
            <CourseTable />
        </AdminLayout>
    )
}

export default Courses
