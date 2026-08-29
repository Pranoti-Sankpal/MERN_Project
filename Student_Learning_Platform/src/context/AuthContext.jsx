import { createContext, useState, useContext, useEffect } from 'react'
import client from '../api/client'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('student-portal-user')
        return savedUser ? JSON.parse(savedUser) : null
    })

    // Whenever user changes, update localStorage
    useEffect(() => {
        if (user) {
            localStorage.setItem('student-portal-user', JSON.stringify(user))
        } else {
            localStorage.removeItem('student-portal-user')
        }
    }, [user])

    const login = async (email, password) => {
        try {
            const response = await client.post('/auth/login', { email, password })
            if (response.data.status === 'success') {
                const userData = response.data.data
                setUser(userData)
                // Store admin token if admin
                if (userData.role === 'admin') {
                    localStorage.setItem('admin-token', userData.token)
                }
                return userData
            } else {
                throw new Error(response.data.error || 'Login failed')
            }
        } catch (error) {
            console.error('Login error:', error)
            throw error
        }
    }

    const register = async (fullName, email, mobile, password) => {
        try {
            const response = await client.post('/auth/register', {
                name: fullName,
                email,
                mobile_no: mobile,
                password
            })

            if (response.data.status === 'success') {
                // Auto login after register? Or just return success
                // For simplicity, we can auto-login or redirect to login.
                // The current flow redirects to My Courses, implying auto-login.
                // Let's force a login or synthesize a user object.
                // Since /register doesn't return a token, we should probably login.
                return login(email, password)
            } else {
                throw new Error(response.data.error || 'Registration failed')
            }
        } catch (error) {
            console.error('Registration error:', error)
            // Better error handling for 404 and network errors
            if (error.response?.status === 404) {
                throw new Error('Backend server not running. Please start the backend server on port 4000.')
            }
            if (error.response?.data?.error) {
                throw new Error(error.response.data.error)
            }
            if (error.message) {
                throw error
            }
            throw new Error('Registration failed. Please check if the backend server is running.')
        }
    }

    // Register to Course (Authenticated or New)
    const registerToCourse = async (name, email, mobile, courseId) => {
        try {
            const response = await client.post('/auth/register-to-course', {
                name,
                email,
                mobile_no: mobile,
                course_id: courseId
            })

            if (response.data.status === 'success') {
                return response.data.data
            } else {
                throw new Error(response.data.error || 'Course registration failed')
            }
        } catch (error) {
            // Properly handle axios errors
            if (error.response?.data?.error) {
                throw new Error(error.response.data.error)
            }
            if (error.message) {
                throw error
            }
            throw new Error('Course registration failed')
        }
    }

    const logout = () => {
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, register, registerToCourse, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
