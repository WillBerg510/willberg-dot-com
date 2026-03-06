import API from "./BaseAPI.js";

const adminAPI = {
  login: async (password) => {
    return await API.post("/admin/login", {
      password: password,
    }, {
      withCredentials: "include",
    });
  },

  verify: async () => {
    return await API.post("/admin/verify", {}, {
      withCredentials: "include",
    });
  },

  signOut: async () => {
    return await API.post("/admin/signout", {}, {
      withCredentials: "include",
    });
  },

  refresh: async () => {
    try {
      return await API.post("/admin/refresh", {}, {
        withCredentials: "include",
      })
    } catch (error) {
      alert(error);
    }
  },

};

export default adminAPI;