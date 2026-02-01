import axios from 'axios';
import config from '../../services/apiConfig';

const getHeaders = () => ({
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'multipart/form-data', 
  }
});

export const makerService = {
  analyzeImage: async (file) => {
    // 1. Prepare the File Data
    const formData = new FormData();
    formData.append('image', file);

    try {
      // 2. Send to Laravel
      const response = await axios.post(`${config.API_URL}/projects`, formData, getHeaders());
      
      // 3. Process the response to match what the UI expects
      const project = response.data.project;
      const aiData = JSON.parse(project.ai_suggestions);

      return {
        id: project.id,
        imageUrl: response.data.image_url,
        material: project.material_detected,
        confidence: 0.95,
        suggestions: aiData.suggestions
      };

    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  },

  getMyProjects: async () => {
    const response = await axios.get(`${config.API_URL}/projects`, getHeaders());
    return response.data;
  }
};