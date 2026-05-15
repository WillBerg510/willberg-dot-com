import { useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from "react";
import projectsAPI from "../api/ProjectsAPI.js";

const Player = ({ project_id }) => {
  const [contentReady, setContentReady] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const queryClient = useQueryClient();
  const project = queryClient.getQueryData([`project-${project_id}`]);

  const onContentReady = () => {
    setContentReady(true);
  };

  const receiveClick = (e) => {
    e.stopPropagation();
  };

  const galleryPrev = () => {
    setGalleryIndex(prev => prev == 0 ? project.content.length - 1 : prev - 1);
  };

  const galleryNext = () => {
    setGalleryIndex(prev => prev == project.content.length - 1 ? 0 : prev + 1);
  };

  return (
    <div style={contentReady ? {display: "flex"} : {display: "none"}} className="projectWindow" onClick={receiveClick}>
      {project.content?.length > 0 && (
        project.contentType == "image" ? <img height="550" src={project.content[0]} onLoad={onContentReady} />
        : project.contentType == "audio" ? <audio controls src={project.content[0]} onLoadedData={onContentReady} />
        : project.contentType == "video" ? <video controls height="550" src={project.content[0]} onLoadedData={onContentReady} />
        : project.contentType == "gallery" ? <div>
          <button onClick={galleryPrev}>Prev</button>
          <button onClick={galleryNext}>Next</button>
          <p />
          <img height="450" src={project.content[galleryIndex]} onLoad={onContentReady} />
        </div>
        : null
      )}
    </div>
  );
};

export default Player;