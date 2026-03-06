import API from "./BaseAPI.js";

const updatesAPI = {
  getUpdates: async () => {
    return await API.get("/updates", {
      withCredentials: "include",
    });
  },

  postUpdate: async (auth_token, update_text) => {
    return await API.post("/updates", {
      text: update_text,
      date: Date.now(),
    }, {
      withCredentials: "include",
    });
  },

  addReaction: async (update_id, reaction) => {
    return await API.patch(`/updates/react/${update_id}`, {
      reaction: reaction,
    }, {
      withCredentials: "include",
    });
  },

  removeReaction: async (update_id, reaction) => {
    return await API.patch(`/updates/unreact/${update_id}`, {
      reaction: reaction,
    }, {
      withCredentials: "include",
    });
  },

  deleteUpdate: async (update_id) => {
    return await API.delete(`/updates/one/${update_id}`, {
      withCredentials: "include",
    });
  },

  clearUpdates: async () => {
    return await API.delete("/updates/clear", {
      withCredentials: "include",
    });
  },
};

export default updatesAPI;