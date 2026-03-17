import projectsAPI from "../api/ProjectsAPI.js";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from '@tanstack/react-query';
import projectGroups from "../constants/projectGroups.js";
import '../stylesheets/Project.css';

const Project = (props) => {
  const { project_id } = props;

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: [`project-${project_id}`],
    queryFn: () => {
      return projectsAPI.getProject(project_id).then(res => {
        res.data.project.date = new Date(res.data.project.date);
        return res.data.project;
      });
    }
  });

  const projectLinkClicked = (linkType) => {
    window.open(project.links[linkType], "_blank");
  };

  const receiveClick = (e) => {
    e.stopPropagation();
  }

  return (
    <div className="projectWindow" onClick={receiveClick}>
      {projectLoading && <p>Loading...</p>}
      {project && <div className="projectInfo">
        <div className="leftProjectColumn">
          <img src={project.thumbnail} className="projectThumbnail" />
          <h1 className="projectName">{project.name}</h1>
          <p className="projectDate">{project.date.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
          }).toUpperCase()}</p>
          {project.groups.map(group => 
            <p className="projectGroup">{projectGroups[group].toUpperCase()}</p>
          )}
        </div>
        <div className="rightProjectColumn">
          <p className="projectDescription">{project.description}</p>
          <div className="projectGallery">
            {project.gallery.map(image =>
              <img className="projectGalleryImage" src={image} />
            )}
          </div>
          <div className="projectLinks">
            {["youtube", "spotify", "link"].map(linkType =>
              <button
                disabled={!project.links[linkType] || project.links[linkType] == ""}
                className={`projectLink projectLink${project.links[linkType] && project.links[linkType] != "" ? "Active" : "Inactive"}`}
                onClick={() => projectLinkClicked(linkType)}
              >
                {linkType.toUpperCase()}
              </button>
            )}
          </div>
        </div>
      </div>}
    </div>
  );
};

export default Project;