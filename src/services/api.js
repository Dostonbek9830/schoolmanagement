// API Service for School Management Application
const API_BASE_URL = '/api';

// Helper function for API calls
const fetchAPI = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'API request failed');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Students API
export const studentsAPI = {
    // Get all students
    getAll: async () => {
        return fetchAPI('/students');
    },

    // Get single student by ID
    getById: async (id) => {
        return fetchAPI(`/students/${id}`);
    },

    // Create new student
    create: async (studentData) => {
        return fetchAPI('/students', {
            method: 'POST',
            body: JSON.stringify(studentData),
        });
    },

    // Update student
    update: async (id, studentData) => {
        return fetchAPI(`/students/${id}`, {
            method: 'PUT',
            body: JSON.stringify(studentData),
        });
    },

    // Delete student
    delete: async (id) => {
        return fetchAPI(`/students/${id}`, {
            method: 'DELETE',
        });
    },
};

// Classes API
export const classesAPI = {
    // Get all classes
    getAll: async () => {
        return fetchAPI('/classes');
    },

    // Get single class by ID
    getById: async (id) => {
        return fetchAPI(`/classes/${id}`);
    },

    // Create new class
    create: async (classData) => {
        return fetchAPI('/classes', {
            method: 'POST',
            body: JSON.stringify(classData),
        });
    },

    // Update class
    update: async (id, classData) => {
        return fetchAPI(`/classes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(classData),
        });
    },

    // Delete class
    delete: async (id) => {
        return fetchAPI(`/classes/${id}`, {
            method: 'DELETE',
        });
    },
};

// Dashboard API
export const dashboardAPI = {
    // Get dashboard statistics
    getStats: async () => {
        return fetchAPI('/dashboard/stats');
    },
};

// Health check
export const healthCheck = async () => {
    return fetchAPI('/health');
};
