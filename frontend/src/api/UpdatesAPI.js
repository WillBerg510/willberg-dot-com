import API from "./BaseAPI.js";

const updatesAPI = {
  getUpdates: async (user_auth_token) => {
    try {
      return await API.get("/updates", {
        headers: {
          "Authorization": `Bearer ${user_auth_token}`,
        },
      });
    } catch (error) {
      alert(error);
    }
  },

  postUpdate: async (auth_token, update_text) => {
    try {
      return await API.post("/updates", {
        text: update_text,
        date: Date.now(),
      }, {
        headers: {
          "Authorization": `Bearer ${auth_token}`,
        },
      });
    } catch (error) {
      alert(error);
    }
  },

  addReaction: async (user_auth_token, update_id, reaction) => {
    try {
      return await API.patch(`/updates/react/${update_id}`, {
        reaction: reaction,
        user_token: user_auth_token,
      });
    } catch (error) {
      alert(error);
    }
  },

  removeReaction: async (user_auth_token, update_id, reaction) => {
    try {
      return await API.patch(`/updates/unreact/${update_id}`, {
        reaction: reaction,
        user_token: user_auth_token,
      });
    } catch (error) {
      alert(error);
    }
  },

  deleteUpdate: async (auth_token, update_id) => {
    try {
      return await API.delete(`/updates/one/${update_id}`, {
        headers: {
          "Authorization": `Bearer ${auth_token}`,
        },
      });
    } catch (error) {
      alert(error);
    }
  },

  clearUpdates: async (auth_token) => {
    try {
      return await API.delete("/updates/clear", {
        headers: {
          "Authorization": `Bearer ${auth_token}`,
        },
      })
    } catch (error) {
      alert(error);
    }
  },
};

export default updatesAPI;