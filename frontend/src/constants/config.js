console.log(import.meta.env.BRANCH);

export const BACKEND = import.meta.env.VITE_BACKEND_PORT
  ? `http://${window.location.hostname}:${import.meta.env.VITE_BACKEND_PORT}`
  : `https://${import.meta.env.BRANCH && import.meta.env.BRANCH != "main" ? "branch" : ""}server.willbergforever.com`;