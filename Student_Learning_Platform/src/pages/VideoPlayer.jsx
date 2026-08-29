import Layout from '../components/layout/Layout'

const VideoPlayer = () => {
    return (
        <Layout showSidebar>
            <div className="max-w-4xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6 text-gray-800"></h1>
                <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg h-96 flex items-center justify-center">
                    <div className="text-center p-8 max-w-lg">
                        <div className="text-xl font-bold mb-4 text-gray-700">some-description</div>
                        <div className="text-red-500 font-bold text-lg mb-2">
                            Video unavailable
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                            This video is restricted. Please check the Google Workspace administrator and/or the network administrator restrictions.
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default VideoPlayer
