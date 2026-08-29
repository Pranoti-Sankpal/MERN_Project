import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline' // Ensure Heroicons version 2 import
import * as courseService from '../../services/courseService'

const CourseTable = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const response = await courseService.getAllCourses();
                if (response.data.status === 'success') {
                    setCourses(response.data.data);
                } else {
                    setError('Failed to load courses');
                }
            } catch (err) {
                setError('Failed to load courses');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                const response = await courseService.deleteCourse(id);
                if (response.data.status === 'success') {
                    setCourses(courses.filter(course => course.course_id !== id));
                } else {
                    alert('Failed to delete course: ' + JSON.stringify(response.data.error));
                }
            } catch (err) {
                alert('Failed to delete course');
            }
        }
    };

    if (loading) return <div>Loading courses...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Course Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Fees</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Start Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">End Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Expire Days</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {courses.map((course, index) => (
                        <tr key={course.course_id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.course_id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.course_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate" title={course.description}>{course.description}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{course.fees}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(course.start_date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(course.end_date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.video_expire_days}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => navigate(`/courses/edit/${course.course_id}`)}
                                        className="bg-yellow-500 text-white p-1.5 rounded hover:bg-yellow-600 transition"
                                        title="Edit"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(course.course_id)}
                                        className="bg-red-500 text-white p-1.5 rounded hover:bg-red-600 transition"
                                        title="Delete"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CourseTable;
