import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import { useAuth } from '../context/AuthContext'
import client from '../api/client'

const MyCourses = () => {
    const { user } = useAuth()
    const [activeCourse, setActiveCourse] = useState(null)
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user?.email) return

        const fetchMyCourses = async () => {
            try {
                setLoading(true)
                // Fetch courses
                const coursesRes = await client.get(`/student/my-courses?email=${user.email}`)
                const videosRes = await client.get(`/student/my-course-videos?email=${user.email}`)

                if (coursesRes.data.status === 'success') {
                    const myCourses = coursesRes.data.data
                    const myVideos = videosRes.data || []

                    // Merge videos into courses
                    const coursesWithVideos = myCourses.map(course => {
                        const courseVideos = myVideos.filter(v => v.course_name === course.course_name)

                        return {
                            id: course.course_id,
                            name: course.course_name,
                            category: course.description || 'Course',
                            startDate: course.start_date ? new Date(course.start_date).toLocaleDateString() : 'N/A',
                            endDate: course.end_date ? new Date(course.end_date).toLocaleDateString() : 'N/A',
                            videos: courseVideos.map((v, idx) => ({
                                id: idx,
                                title: v.title,
                                addedDate: v.added_at ? new Date(v.added_at).toLocaleDateString() : 'N/A'
                            }))
                        }
                    })
                    setCourses(coursesWithVideos)
                }
            } catch (err) {
                console.error("Error fetching my courses", err)
            } finally {
                setLoading(false)
            }
        }
        fetchMyCourses()
    }, [user])

    return (
        <Layout showSidebar>
            <div className="max-w-4xl mx-auto p-4">
                <Link to="/" className="inline-block bg-blue-600 text-white px-4 py-2 rounded mb-6 hover:bg-blue-700 font-medium transition">
                    Back to Courses
                </Link>

                <h1 className="text-2xl font-bold mb-6 text-gray-800">My Registered Courses</h1>

                {loading ? (
                    <div className="text-gray-500">Loading your courses...</div>
                ) : (
                    <div className="space-y-4">
                        {courses.map(course => (
                            <div key={course.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition">
                                <div
                                    className="bg-gray-50 p-4 cursor-pointer flex justify-between items-center"
                                    onClick={() => setActiveCourse(activeCourse === course.id ? null : course.id)}
                                >
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800">{course.name}</h3>
                                        <p className="text-gray-600 text-sm mt-1">{course.category}</p>
                                    </div>
                                    <span className="text-blue-600 font-medium hover:text-blue-800">
                                        {activeCourse === course.id ? 'Hide Videos' : 'Show Videos'}
                                    </span>
                                </div>

                                {activeCourse === course.id && (
                                    <div className="p-5 border-t border-gray-100 animate-fadeIn">
                                        <div className="text-gray-700 mb-4 bg-blue-50 p-3 rounded text-sm">
                                            <strong>Start:</strong> {course.startDate} <span className="mx-2">|</span> <strong>End:</strong> {course.endDate}
                                        </div>

                                        <h4 className="font-bold mb-3 text-gray-800">Course Videos</h4>
                                        {course.videos.length > 0 ? (
                                            <div className="space-y-1">
                                                {course.videos.map(video => (
                                                    <Link
                                                        key={video.id}
                                                        to={`/course/${course.id}/video`}
                                                        className="block p-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded transition flex justify-between items-center group"
                                                    >
                                                        <div className="font-medium text-gray-700 group-hover:text-blue-600">{video.title}</div>
                                                        {/* <div className="text-gray-400 text-xs">Added: {video.addedDate}</div> */}
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 italic">No videos available yet.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                        {courses.length === 0 && <div className="text-gray-500">You are not registered for any courses.</div>}
                    </div>
                )}
            </div>
        </Layout>
    )
}

export default MyCourses
