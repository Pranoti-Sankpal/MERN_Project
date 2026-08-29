import { useParams, useNavigate } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useState, useEffect } from 'react'
import Layout from '../components/layout/Layout'
import { useAuth } from '../context/AuthContext'
import client from '../api/client'

const CourseDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { registerToCourse, user } = useAuth()
    const [showSuccess, setShowSuccess] = useState(false)
    const [course, setCourse] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                // Fetch all courses to properly find the requested one regardless of active status
                const response = await client.get('/admin/all-courses')
                if (response.data.status === 'success') {
                    const found = response.data.data.find(c => c.course_id === parseInt(id))
                    if (found) {
                        setCourse({
                            id: found.course_id,
                            name: found.course_name,
                            prefix: found.course_name.substring(0, 2).toUpperCase(),
                            description: found.description || 'No description available',
                            startDate: new Date(found.start_date).toLocaleDateString(),
                            endDate: new Date(found.end_date).toLocaleDateString(),
                            fees: found.fees
                        })
                    }
                }
            } catch (e) { console.error(e) }
        }
        fetchCourse()
    }, [id])

    if (!course) return <Layout><div className="text-center text-lg text-gray-600 mt-20">
  🔒 If you want to see course descriptions, please{' '}
  <a
    href="/login"
    className="text-blue-600 font-semibold hover:underline"
  >
    Login
  </a>
  . If you don’t have an account,{' '}
  <a
    href="/register"
    className="text-blue-600 font-semibold hover:underline"
  >
    Register here
  </a>
  .
</div>
</Layout>

    const CourseInfo = () => (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">{course.name}</h1>
            <div className="bg-blue-50 p-4 rounded-lg mb-6 inline-block">
                <span className="font-bold text-blue-800 text-xl tracking-wider">{course.prefix}</span>
            </div>
            <div className="space-y-4 text-gray-700 text-lg mb-6">
                <p><span className="font-semibold w-32 inline-block">Start Date:</span> {course.startDate}</p>
                <p><span className="font-semibold w-32 inline-block">End Date:</span> {course.endDate || 'TBD'}</p>
                <p><span className="font-semibold w-32 inline-block">Fees:</span> ₹{course.fees?.toLocaleString() || 'N/A'}</p>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
                <h2 className="text-xl font-bold mb-3 text-gray-800">Course Description</h2>
                <p className="text-gray-700 leading-relaxed">{course.description}</p>
            </div>
        </div>
    )

    // Registration form section (right column)
    const RegistrationForm = () => (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Register to Course</h2>

            {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                    {errorMessage}
                </div>
            )}

            {showSuccess ? (
                <div className="text-center py-8">
                    <div className="text-green-600 text-xl font-bold mb-2">Registration Successful!</div>
                    <p className="text-gray-600">Redirecting to your courses...</p>
                </div>
            ) : (
                <Formik
                    initialValues={{ fullName: user?.name || '', email: user?.email || '', mobileNumber: user?.mobile_no || '' }} // Pre-fill if user known
                    enableReinitialize
                    validationSchema={Yup.object({
                        fullName: Yup.string().required('Required'),
                        email: Yup.string().email('Invalid email').required('Required'),
                        mobileNumber: Yup.string().matches(/^[0-9]{10}$/, '10 digits required').required('Required')
                    })}
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            setErrorMessage(null)
                            await registerToCourse(values.fullName, values.email, values.mobileNumber, course.id)
                            setSubmitting(false)
                            setShowSuccess(true)
                            setTimeout(() => {
                                navigate('/my-courses')
                            }, 2000)
                        } catch (error) {
                            setSubmitting(false)
                            const errorMsg = error.response?.data?.error || error.message || 'Registration failed'
                            setErrorMessage(errorMsg)
                        }
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4">
                            <div>
                                <label className="block text-gray-700 mb-1 text-sm font-medium">Full Name</label>
                                <Field name="fullName" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                                <ErrorMessage name="fullName" component="div" className="text-red-500 text-xs mt-1" />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1 text-sm font-medium">Email</label>
                                <Field name="email" type="email" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                                <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1 text-sm font-medium">Mobile Number</label>
                                <Field name="mobileNumber" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="10 digits" />
                                <ErrorMessage name="mobileNumber" component="div" className="text-red-500 text-xs mt-1" />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 font-medium transition"
                            >
                                {isSubmitting ? 'Registering...' : 'Register to Course'}
                            </button>
                        </Form>
                    )}
                </Formik>
            )}
        </div>
    )

    return (
        <Layout>
            <div className="max-w-6xl mx-auto px-4 mt-8">
                <button onClick={() => navigate('/')} className="mb-6 text-blue-600 hover:underline flex items-center">
                    &larr; Back to Courses
                </button>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <CourseInfo />
                    <RegistrationForm />
                </div>
            </div>
        </Layout>
    )
}

export default CourseDetail
