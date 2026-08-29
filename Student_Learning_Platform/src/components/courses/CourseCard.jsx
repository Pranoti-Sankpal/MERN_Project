import { useNavigate } from 'react-router-dom'

const CourseCard = ({ course }) => {
    const navigate = useNavigate()

    // Helper to handle navigation - check if fullCourseId exists for available courses
    const handleClick = () => {
        const id = course.fullCourseId || course.id
        navigate(`/courses/${id}`)
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col items-center p-6 text-center h-full">
            {/* Logo/Image Area - mimicking the colorful icons in the image */}
            <div className="w-full h-40 mb-4 flex items-center justify-center bg-gray-50 rounded-md">
                {/* We use the prefix to generate a simple visual if we don't have the exact logos */}
                <div className="text-center">
                    <span className="text-3xl font-black text-gray-300 tracking-wider block">{course.prefix}</span>
                </div>
            </div>

            <h3 className="font-bold text-lg mb-2 text-gray-800">{course.name}</h3>
            <p className="text-gray-500 text-sm mb-6">Starts on: {course.startDate}</p>

            <button
                onClick={handleClick}
                className="mt-auto bg-blue-600 text-white px-8 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
            >
                View More
            </button>
        </div>
    )
}

export default CourseCard
