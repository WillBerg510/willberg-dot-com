import API from "./BaseAPI.js";

const userAPI = {
  verify: async () => {
    return await API.post("/user/verify", {}, {
      withCredentials: "include",
    });
  },

  getUser: async () => {
    return await API.post("/user", {}, {
      withCredentials: "include",
    });
  },

  refresh: async () => {
    try {
      return await API.post("/user/refresh", {}, {
        withCredentials: "include",
      });
    } catch (error) {
      alert(error);
    }
  },
};

export default userAPI;