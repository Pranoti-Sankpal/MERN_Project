import api from './api';

export const getAllVideos = (courseId) => api.get(`/videos/all-videos?courseId=${courseId}`);
export const addVideo = (videoData) => api.post('/videos/add', videoData);
export const updateVideo = (id, videoData) => api.put(`/videos/update/${id}`, videoData);
export const deleteVideo = (id) => api.delete(`/videos/delete/${id}`);
