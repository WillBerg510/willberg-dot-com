import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useState, useEffect } from "react";
import projectsAPI from "../api/ProjectsAPI.js";

const Player = ({ project_id }) => {
  const [contentReady, setContentReady] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const queryClient = useQueryClient();

  const { data: project } = useQuery({
    queryKey: [`project-${project_id}`],
    queryFn: () => {
      return projectsAPI.getProject(project_id).then(res => {
        res.data.project.date = new Date(res.data.project.date);
        return res.data.project;
      });
    }
  });

  const onContentReady = () => {
    setContentReady(prev => prev + 1);
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
    <div style={contentReady == project.content.length ? {display: "flex"} : {display: "none"}} className="projectWindow" onClick={receiveClick}>
      {project.content.length > 0 && (
        project.contentType == "image" ? <img height="550" src={project.content[0]} onLoad={onContentReady} />
        : project.contentType == "audio" ? <audio controls src={project.content[0]} onLoadedData={onContentReady} />
        : project.contentType == "video" ? <video controls height="550" src={project.content[0]} onLoadedData={onContentReady} />
        : project.contentType == "gallery" ? <div>
          {contentReady != project.content.length && project.content.map((image, index) => <img src={project.content[index]} onLoad={onContentReady} />)}
          <button onClick={galleryPrev}>Prev</button>
          <button onClick={galleryNext}>Next</button>
          <p />
          <h2 className="contentName">{project.contentNames[galleryIndex]}</h2>
          <img height="400" src={project.content[galleryIndex]} />
        </div>
        : null
      )}
    </div>
  );
};

export default Player;