import { useState, useEffect } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import * as courseService from '../../services/courseService'

const Students = () => {
    const [courses, setCourses] = useState([])
    const [selectedCourseId, setSelectedCourseId] = useState('')
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await courseService.getAllCourses()
                if (response.data.status === 'success') {
                    setCourses(response.data.data)
                }
            } catch (err) {
                console.error("Failed to fetch courses", err)
            }
        }
        fetchCourses()
    }, [])

    const handleCourseChange = async (e) => {
        const courseId = e.target.value
        setSelectedCourseId(courseId)
        if (!courseId) {
            setStudents([])
            return
        }

        try {
            setLoading(true)
            setError(null)
            const response = await courseService.getEnrolledStudents(courseId)
            if (response.data.status === 'success') {
                setStudents(response.data.data)
            } else {
                setError('Failed to fetch students')
            }
        } catch (err) {
            setError('Failed to fetch students')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Student Management</h1>

            <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <label className="block text-gray-700 font-medium mb-2">Select Course to View Students</label>
                <select
                    value={selectedCourseId}
                    onChange={handleCourseChange}
                    className="w-full md:w-1/2 p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                    <option value="">-- Select a Course --</option>
                    {courses.map(course => (
                        <option key={course.course_id} value={course.course_id}>
                            {course.course_name}
                        </option>
                    ))}
                </select>
            </div>

            {loading && <div className="text-center py-8">Loading students...</div>}

            {error && <div className="bg-red-50 text-red-600 p-4 rounded mb-6">{error}</div>}

            {!loading && selectedCourseId && students.length === 0 && (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    No students enrolled in this course yet.
                </div>
            )}

            {!loading && students.length > 0 && (
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Reg No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Mobile</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {students.map((student, index) => (
                                <tr key={student.reg_no} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.reg_no}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.mobile_no}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminLayout>
    )
}

export default Students
