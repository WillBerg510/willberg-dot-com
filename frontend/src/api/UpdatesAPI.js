import API from "./BaseAPI.js";

const updatesAPI = {
  getUpdates: async () => {
    return await API.get("/updates", {}, {
      withCredentials: "include",
    });
  },

  postUpdate: async (auth_token, update_text) => {
    return await API.post("/updates", {
      text: update_text,
      date: Date.now(),
    }, {
      headers: {
        "Authorization": `Bearer ${auth_token}`,
      },
    });
  },

  addReaction: async (user_auth_token, update_id, reaction) => {
    return await API.patch(`/updates/react/${update_id}`, {
      reaction: reaction,
      user_token: user_auth_token,
    });
  },

  removeReaction: async (user_auth_token, update_id, reaction) => {
    return await API.patch(`/updates/unreact/${update_id}`, {
      reaction: reaction,
      user_token: user_auth_token,
    });
  },

  deleteUpdate: async (auth_token, update_id) => {
    return await API.delete(`/updates/one/${update_id}`, {
      headers: {
        "Authorization": `Bearer ${auth_token}`,
      },
    });
  },

  clearUpdates: async (auth_token) => {
    return await API.delete("/updates/clear", {
      headers: {
        "Authorization": `Bearer ${auth_token}`,
      },
    })
  },
};

export default updatesAPI;