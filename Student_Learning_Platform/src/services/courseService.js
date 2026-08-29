import api from './api';

export const getAllCourses = () => api.get('/admin/all-courses');
export const getActiveCourses = () => api.get('/student/all-courses');
export const addCourse = (courseData) => api.post('/admin/addCourse', courseData);
export const updateCourse = (id, courseData) => api.put(`/admin/update/${id}`, courseData);
export const deleteCourse = (id) => api.delete(`/admin/delete/${id}`);
export const getEnrolledStudents = (courseId) => api.get(`/admin/enrolled-students?course_id=${courseId}`);
