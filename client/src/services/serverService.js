import api from './api';

export const serverService = {
  async getServers() {
    const response = await api.get('/api/servers');
    return response.data;
  },

  async createServer({ name, icon }) {
    const response = await api.post('/api/servers', { name, icon });
    return response.data;
  },

  async getServer(serverId) {
    const response = await api.get(`/api/servers/${serverId}`);
    return response.data;
  },

  async updateServer(serverId, { name, icon }) {
    const response = await api.patch(`/api/servers/${serverId}`, { name, icon });
    return response.data;
  },

  async deleteServer(serverId) {
    const response = await api.delete(`/api/servers/${serverId}`);
    return response.data;
  },

  async leaveServer(serverId) {
    const response = await api.delete(`/api/servers/${serverId}/leave`);
    return response.data;
  },
};

export default serverService;

