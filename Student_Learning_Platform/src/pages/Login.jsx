import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/layout/Layout'

const Login = () => {
    const { login } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || '/my-courses'

    return (
        <Layout>
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200 mt-12">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login to your account</h2>

                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={Yup.object({
                        email: Yup.string().email('Invalid email address').required('Email is required'),
                        password: Yup.string().required('Password is required')
                    })}
                    onSubmit={async (values, { setSubmitting, setErrors }) => {
                        try {
                            const userData = await login(values.email, values.password)
                            if (userData.role === 'admin') {
                                navigate('/dashboard')
                            } else {
                                navigate(from, { replace: true })
                            }
                        } catch (error) {
                            setSubmitting(false)
                            setErrors({ email: error.message || 'Invalid email or password' })
                        }
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-5">
                            <div>
                                <label className="block text-gray-700 mb-1 font-medium">Email Address</label>
                                <Field name="email" type="email" className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1 font-medium">Password</label>
                                <Field name="password" type="password" className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 text-white py-2.5 rounded font-medium hover:bg-blue-700 transition disabled:opacity-70"
                            >
                                {isSubmitting ? 'Logging in...' : 'Login'}
                            </button>

                            <div className="text-center text-sm text-gray-600">
                                Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Layout>
    )
}

export default Login
