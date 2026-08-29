import Navbar from './Navbar'
import Sidebar from './Sidebar'

const Layout = ({ children, showSidebar = false }) => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
            <div className="z-50 relative">
                <Navbar />
            </div>
            <div className="flex flex-1 relative">
                {showSidebar && <Sidebar />}
                <main className={`flex-1 p-6 ${showSidebar ? 'lg:ml-64' : ''}`}>
                    {children}
                </main>
            </div>
        </div>
    )
}

export default Layout
