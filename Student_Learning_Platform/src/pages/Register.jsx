import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/layout/Layout'

const Register = () => {
    const { register } = useAuth()
    const navigate = useNavigate()

    return (
        <Layout>
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200 mt-12">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create an Account</h2>

                <Formik
                    initialValues={{ fullName: '', email: '', mobileNumber: '', password: '' }}
                    validationSchema={Yup.object({
                        fullName: Yup.string().required('Full Name is required'),
                        email: Yup.string().email('Invalid email address').required('Email is required'),
                        mobileNumber: Yup.string().matches(/^[0-9]{10}$/, 'Must be exactly 10 digits').required('Mobile number is required'),
                        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
                    })}
                    onSubmit={async (values, { setSubmitting, setErrors }) => {
                        try {
                            await register(values.fullName, values.email, values.mobileNumber, values.password)
                            navigate('/my-courses')
                        } catch (error) {
                            setSubmitting(false)
                            setErrors({ email: error.message || 'Registration failed' })
                        }
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-5">
                            <div>
                                <label className="block text-gray-700 mb-1 font-medium">Full Name</label>
                                <Field name="fullName" type="text" className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                                <ErrorMessage name="fullName" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1 font-medium">Email Address</label>
                                <Field name="email" type="email" className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-1 font-medium">Mobile Number</label>
                                <Field name="mobileNumber" type="text" className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="10 digits" />
                                <ErrorMessage name="mobileNumber" component="div" className="text-red-500 text-sm mt-1" />
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
                                {isSubmitting ? 'Registering...' : 'Register'}
                            </button>

                            <div className="text-center text-sm text-gray-600">
                                Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Layout>
    )
}

export default Register
