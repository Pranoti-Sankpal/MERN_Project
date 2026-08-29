import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/layout/Layout'
import * as studentService from '../services/studentService'

const ChangePassword = () => {
    const { user } = useAuth()
    const navigate = useNavigate()

    if (!user) {
        navigate('/login')
        return null
    }

    return (
        <Layout>
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200 mt-12">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Change Password</h2>

                <Formik
                    initialValues={{ newPassword: '', confirmPassword: '' }}
                    validationSchema={Yup.object({
                        newPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('New Password is required'),
                        confirmPassword: Yup.string()
                            .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
                            .required('Confirm Password is required')
                    })}
                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                        try {
                            const response = await studentService.changePassword(user.email, values.newPassword, values.confirmPassword)
                            if (response.data.status === 'success') {
                                alert('Password changed successfully')
                                resetForm()
                                navigate('/my-courses')
                            } else {
                                alert('Failed to change password: ' + (response.data.error || response.data.message || 'Unknown error'))
                            }
                        } catch (error) {
                            alert('Failed to change password: ' + (error.response?.data?.message || error.message))
                        } finally {
                            setSubmitting(false)
                        }
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-5">
                            <div>
                                <label className="block text-gray-700 mb-1 font-medium">New Password</label>
                                <Field name="newPassword" type="password" className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                                <ErrorMessage name="newPassword" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1 font-medium">Confirm New Password</label>
                                <Field name="confirmPassword" type="password" className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 text-white py-2.5 rounded font-medium hover:bg-blue-700 transition disabled:opacity-70"
                            >
                                {isSubmitting ? 'Changing...' : 'Change Password'}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </Layout>
    )
}

export default ChangePassword
