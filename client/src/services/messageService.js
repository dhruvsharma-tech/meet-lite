import api from './api';

export const messageService = {
  async getMessages(channelId, cursor) {
    const params = new URLSearchParams();
    params.append('limit', '50');
    if (cursor) {
      params.append('cursor', cursor);
    }

    const response = await api.get(`/api/channels/${channelId}/messages?${params.toString()}`);
    return response.data; // { messages: [...], nextCursor: string | null }
  },
};

export default messageService;

