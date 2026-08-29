import api from './api';

export const changePassword = (email, newPassword, confirmPassword) => {
    return api.put('/student/change-password', {
        email,
        newPassword,
        confirmpassword: confirmPassword
    });
};

export const getMyCourses = (email) => api.get(`/student/my-courses?email=${email}`);
export const getMyCourseVideos = (email) => api.get(`/student/my-course-videos?email=${email}`);
