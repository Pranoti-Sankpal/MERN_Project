export const mockCourses = [
    {
        id: 1,
        name: 'IIT-MERN-2025',
        prefix: 'US M E R N',
        category: 'MERN',
        startDate: '10 Dec 2025',
        endDate: '05/01/2026',
        fees: '4000',
        videos: [
            { id: 1, title: 'MERN video 6', addedDate: '26 Nov 2025' },
            { id: 2, title: 'MERN 10', addedDate: '26 Nov 2025' }
        ]
    },
    {
        id: 2,
        name: 'AI',
        prefix: 'AI',
        category: 'AI',
        startDate: '24 Nov 2025',
        endDate: '05/01/2026',
        fees: '5000',
        videos: [
            { id: 1, title: 'Intro to AI', addedDate: '24 Nov 2025' }
        ]
    },
    {
        id: 3,
        name: 'Android',
        prefix: 'Android',
        category: 'Android',
        startDate: '24 Nov 2025',
        endDate: '05/01/2026',
        fees: '4500',
        videos: []
    },
    {
        id: 4,
        name: 'python',
        prefix: 'Python',
        category: 'Python',
        startDate: '24 Nov 2025',
        endDate: '05/01/2026',
        fees: '3000',
        videos: []
    }
]

export const mockAvailableCourses = [
    { id: 1, name: 'IIT-MERN-2025', prefix: 'US M E R N', startDate: '10 Dec 2025', fullCourseId: 1 },
    { id: 2, name: 'AI', prefix: 'AI', startDate: '24 Nov 2025', fullCourseId: 2 },
    { id: 3, name: 'Android', prefix: 'Android', startDate: '24 Nov 2025', fullCourseId: 3 },
    { id: 4, name: 'python', prefix: 'Python', startDate: '24 Nov 2025', fullCourseId: 4 }
]
