import { useEffect, useState } from 'react'
import Layout from '../components/layout/Layout'
import CourseCard from '../components/courses/CourseCard'
import client from '../api/client'

const Home = () => {
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await client.get('/student/all-courses')
                if (response.data.status === 'success') {
                    // Map DB fields to Component fields
                    const mappedCourses = response.data.data.map(c => ({
                        id: c.course_id,
                        name: c.course_name,
                        prefix: c.course_name.substring(0, 2).toUpperCase(), // Simple prefix logic
                        startDate: new Date(c.start_date).toLocaleDateString(),
                        endDate: new Date(c.end_date).toLocaleDateString(),
                        fees: c.fees,
                        fullCourseId: c.course_id
                    }))
                    setCourses(mappedCourses)
                }
            } catch (error) {
                console.error('Error fetching courses:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCourses()
    }, [])

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-3xl text-center mb-10 text-gray-800 mt-4">Available Courses</h1>
                {loading ? (
                    <div className="text-center">Loading courses...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                        {courses.map(course => (
                            <div key={course.id} className="w-full max-w-sm">
                                <CourseCard course={course} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    )
}

export default Home
