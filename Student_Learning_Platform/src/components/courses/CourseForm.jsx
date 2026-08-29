import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const CourseForm = ({ initialValues, onSubmit, isEditing }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{isEditing ? 'Edit Course' : 'Add New Course'}</h2>

            <Formik
                initialValues={initialValues}
                validationSchema={Yup.object({
                    course_name: Yup.string().required('Course Name is required'),
                    description: Yup.string().required('Description is required'),
                    fees: Yup.number().required('Fees is required').positive('Fees must be positive'),
                    start_date: Yup.date().required('Start Date is required'),
                    end_date: Yup.date().required('End Date is required').min(Yup.ref('start_date'), 'End Date must be after Start Date'),
                    video_expire_days: Yup.number().required('Expire Days is required').positive().integer()
                })}
                onSubmit={onSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Course Name</label>
                                <Field name="course_name" className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. MERN Stack" />
                                <ErrorMessage name="course_name" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Fees (₹)</label>
                                <Field name="fees" type="number" className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" placeholder="0" />
                                <ErrorMessage name="fees" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Description</label>
                            <Field name="description" as="textarea" rows="3" className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" placeholder="Course description..." />
                            <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Start Date</label>
                                <Field name="start_date" type="date" className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" />
                                <ErrorMessage name="start_date" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">End Date</label>
                                <Field name="end_date" type="date" className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" />
                                <ErrorMessage name="end_date" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Video Expire Days</label>
                                <Field name="video_expire_days" type="number" className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" placeholder="180" />
                                <ErrorMessage name="video_expire_days" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
                            <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition shadow disabled:opacity-70">
                                {isSubmitting ? 'Saving...' : (isEditing ? 'Update Course' : 'Create Course')}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default CourseForm
