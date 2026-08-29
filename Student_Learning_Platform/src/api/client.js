import axios from 'axios'

const client = axios.create({
    // Vite proxy will handle this
    baseURL: '/api'
})

// Add token to requests if it exists
client.interceptors.request.use((config) => {
    const userStr = localStorage.getItem('student-portal-user')
    if (userStr) {
        const user = JSON.parse(userStr)
        if (user.token) {
            config.headers.token = user.token
        }
    }
    return config
})

export default client
