import axios from 'axios';
import config from '../../services/apiConfig';

export const chatService = {
    // 1. Start Chat (Creates or Finds a conversation)
    startChat: async (receiverId) => {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${config.API_URL}/chat/start`, 
            { receiver_id: receiverId },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data; // Returns the conversation object
    },

    // 2. Get Inbox (List of people)
    getConversations: async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${config.API_URL}/chat/conversations`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // 3. Get Messages (History)
    getMessages: async (conversationId) => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${config.API_URL}/chat/${conversationId}/messages`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

 
    sendMessage: async (conversationId, text, attachment = null) => {
        const token = localStorage.getItem('token');
        
        // ✅ Use FormData for files
        const formData = new FormData();
        formData.append('conversation_id', conversationId);
        if (text) formData.append('text', text);
        if (attachment) formData.append('attachment', attachment);

        const response = await axios.post(`${config.API_URL}/chat/send`, formData, {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data' // Critical for files
            }
        });
        return response.data;
    },
    // ... existing functions ...

    // 5. Edit Message
    editMessage: async (messageId, newText) => {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${config.API_URL}/chat/message/${messageId}`, 
            { text: newText },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    },

    // 6. Delete Message (type: 'me' or 'everyone')
    deleteMessage: async (messageId, type) => {
        const token = localStorage.getItem('token');
        await axios.delete(`${config.API_URL}/chat/message/${messageId}`, {
            data: { type }, // DELETE requires body in 'data' field
            headers: { Authorization: `Bearer ${token}` }
        });
    }
    
};