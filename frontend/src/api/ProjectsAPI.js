import API from "./BaseAPI.js";

const projectsAPI = {
  postProject: async (projectInput) => {
    const form = new FormData();
    Object.entries(projectInput).forEach(([key, value]) => {
      if (key == "gallery") {
        value.forEach((image, index) => {
          form.append(`gallery${index}`, image);
        })
      } else {
        form.append(key, value);
      }
    });
    return await API.post("/projects", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default projectsAPI;