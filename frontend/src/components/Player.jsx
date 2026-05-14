import { useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from "react";
import projectsAPI from "../api/ProjectsAPI.js";

const Player = ({ project_id }) => {
  const [contentReady, setContentReady] = useState(false);
  const queryClient = useQueryClient();
  const project = queryClient.getQueryData([`project-${project_id}`]);

  const onContentReady = () => {
    setContentReady(true);
  };

  const receiveClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div style={contentReady ? {display: "flex"} : {display: "none"}} className="projectWindow" onClick={receiveClick}>
      {project.content && (
        project.contentType == "image" ? <img height="550" src={project.content} onLoad={onContentReady} />
        : project.contentType == "audio" ? <audio controls src={project.content} onLoadedData={onContentReady} />
        : project.contentType == "video" ? <video controls height="550" src={project.content} onLoadedData={onContentReady} />
        : null
      )}
    </div>
  );
};

export default Player;