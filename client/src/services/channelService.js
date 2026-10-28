import api from './api';

export const channelService = {
  async createChannel(serverId, { name, type = 'TEXT' }) {
    const response = await api.post(`/api/servers/${serverId}/channels`, { name, type });
    return response.data;
  },

  async updateChannel(serverId, channelId, { name }) {
    const response = await api.patch(`/api/servers/${serverId}/channels/${channelId}`, { name });
    return response.data;
  },

  async deleteChannel(serverId, channelId) {
    const response = await api.delete(`/api/servers/${serverId}/channels/${channelId}`);
    return response.data;
  },
};

export default channelService;

