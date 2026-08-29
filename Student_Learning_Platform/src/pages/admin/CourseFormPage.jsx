import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import CourseForm from '../../components/courses/CourseForm'
import * as courseService from '../../services/courseService'

const CourseFormPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const isEditing = !!id
    const [initialValues, setInitialValues] = useState({
        course_name: '',
        description: '',
        fees: '',
        start_date: '',
        end_date: '',
        video_expire_days: ''
    })
    const [loading, setLoading] = useState(isEditing)

    useEffect(() => {
        if (isEditing) {
            const fetchCourse = async () => {
                try {
                    const response = await courseService.getAllCourses()
                    const course = response.data.data.find(c => c.course_id === parseInt(id))
                    if (course) {
                        // Format dates for input field (YYYY-MM-DD)
                        const formatDate = (dateString) => {
                            if (!dateString) return ''
                            return new Date(dateString).toISOString().split('T')[0]
                        }

                        setInitialValues({
                            course_name: course.course_name,
                            description: course.description,
                            fees: course.fees,
                            start_date: formatDate(course.start_date),
                            end_date: formatDate(course.end_date),
                            video_expire_days: course.video_expire_days
                        })
                    }
                } catch (error) {
                    console.error('Failed to fetch course', error)
                } finally {
                    setLoading(false)
                }
            }
            fetchCourse()
        }
    }, [id, isEditing])

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            let response;
            if (isEditing) {
                response = await courseService.updateCourse(id, values)
            } else {
                response = await courseService.addCourse(values)
            }

            if (response.data.status === 'success') {
                navigate('/courses')
            } else {
                alert('Failed to save course: ' + JSON.stringify(response.data.error))
            }
        } catch (error) {
            alert('Failed to save course: ' + (error.response?.data?.error || error.message))
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <AdminLayout><div>Loading...</div></AdminLayout>

    return (
        <AdminLayout>
            <button onClick={() => navigate('/courses')} className="mb-4 text-blue-600 hover:underline">← Back to Courses</button>
            <CourseForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
                isEditing={isEditing}
            />
        </AdminLayout>
    )
}

export default CourseFormPage
