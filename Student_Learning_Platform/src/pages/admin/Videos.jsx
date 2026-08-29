import { useState, useEffect } from 'react'
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import AdminLayout from '../../components/layout/AdminLayout'
import * as courseService from '../../services/courseService'
import * as videoService from '../../services/videoService'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const Videos = () => {
    const [courses, setCourses] = useState([])
    const [selectedCourseId, setSelectedCourseId] = useState('')
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingVideo, setEditingVideo] = useState(null)

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

    const fetchVideos = async (courseId) => {
        if (!courseId) {
            setVideos([])
            return
        }
        try {
            setLoading(true)
            setError(null)
            const response = await videoService.getAllVideos(courseId)
            if (response.data.status === 'success') {
                setVideos(response.data.data)
            } else {
                setError('Failed to fetch videos')
            }
        } catch (err) {
            setError('Failed to fetch videos')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleCourseChange = (e) => {
        const courseId = e.target.value
        setSelectedCourseId(courseId)
        fetchVideos(courseId)
    }

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this video?')) {
            try {
                const response = await videoService.deleteVideo(id)
                if (response.data.status === 'success') {
                    setVideos(videos.filter(v => v.video_id !== id))
                } else {
                    alert('Failed to delete video')
                }
            } catch (err) {
                alert('Failed to delete video')
            }
        }
    }

    const openModal = (video = null) => {
        setEditingVideo(video)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setEditingVideo(null)
        setIsModalOpen(false)
    }

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            let response
            if (editingVideo) {
                response = await videoService.updateVideo(editingVideo.video_id, { ...values, courseId: selectedCourseId })
            } else {
                response = await videoService.addVideo({ ...values, courseId: selectedCourseId })
            }

            if (response.data.status === 'success') {
                fetchVideos(selectedCourseId)
                closeModal()
            } else {
                alert('Failed to save video: ' + JSON.stringify(response.data.error))
            }
        } catch (error) {
            alert('Failed to save video')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Video Management</h1>
                {selectedCourseId && (
                    <button
                        onClick={() => openModal()}
                        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition flex items-center gap-2"
                    >
                        <PlusIcon className="h-5 w-5" /> Add Video
                    </button>
                )}
            </div>

            <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <label className="block text-gray-700 font-medium mb-2">Select Course to Manage Videos</label>
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

            {loading && <div className="text-center py-8">Loading videos...</div>}
            {error && <div className="bg-red-50 text-red-600 p-4 rounded mb-6">{error}</div>}

            {!loading && selectedCourseId && videos.length === 0 && (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    No videos found for this course.
                </div>
            )}

            {!loading && videos.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map(video => (
                        <div key={video.video_id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex flex-col">
                            <div className="p-4 flex-1">
                                <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2">{video.title}</h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{video.description}</p>
                                <a href={video.youtube_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline break-all">
                                    Watch Video
                                </a>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex justify-end space-x-2">
                                <button
                                    onClick={() => openModal(video)}
                                    className="p-2 text-yellow-600 hover:bg-yellow-50 rounded transition"
                                    title="Edit"
                                >
                                    <PencilIcon className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(video.video_id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                                    title="Delete"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800">{editingVideo ? 'Edit Video' : 'Add New Video'}</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                        </div>
                        <div className="p-6">
                            <Formik
                                initialValues={{
                                    title: editingVideo?.title || '',
                                    description: editingVideo?.description || '',
                                    youtubeURL: editingVideo?.youtube_url || ''
                                }}
                                validationSchema={Yup.object({
                                    title: Yup.string().required('Title is required'),
                                    description: Yup.string().required('Description is required'),
                                    youtubeURL: Yup.string().url('Invalid URL').required('YouTube URL is required')
                                })}
                                onSubmit={handleSubmit}
                            >
                                {({ isSubmitting }) => (
                                    <Form className="space-y-4">
                                        <div>
                                            <label className="block text-gray-700 mb-1 font-medium">Video Title</label>
                                            <Field name="title" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                                            <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 mb-1 font-medium">Description</label>
                                            <Field name="description" as="textarea" rows="3" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                                            <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 mb-1 font-medium">YouTube URL</label>
                                            <Field name="youtubeURL" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                                            <ErrorMessage name="youtubeURL" component="div" className="text-red-500 text-sm mt-1" />
                                        </div>
                                        <div className="flex justify-end space-x-3 mt-6">
                                            <button
                                                type="button"
                                                onClick={closeModal}
                                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition disabled:opacity-70"
                                            >
                                                {isSubmitting ? 'Saving...' : 'Save Video'}
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}

export default Videos
