import MusicIcon from '../assets/Music Icon.png';
import InteractiveIcon from '../assets/Interactive Icon.png';
import VideoIcon from '../assets/Video Icon.png';
import ArtIcon from '../assets/Art Icon.png';
import PhotosIcon from '../assets/Photos Icon.png';

const icons = {
  "music": MusicIcon,
  "interactive": InteractiveIcon,
  "video": VideoIcon,
  "art": ArtIcon,
  "photos": PhotosIcon,
}

const GroupList = (props) => {
  const {groupProjects, setOpenProject} = props;

  return (
    <div>
      {groupProjects.map(project => <div style={{display: "flex", width: "700px"}}>
        <img style={{cursor: "pointer"}} height="100" src={project.thumbnail} onClick={() => setOpenProject(project._id)} />
        <div>
          <div style={{display: "flex"}}>
            <img height="60" src={icons[project.icon]} />
            <h2 style={{textAlign: "left"}}>{project.name}</h2>
          </div>
          <p style={{textAlign: "left"}}>{project.date.toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            timeZone: "UTC",
          })}</p>
        </div>
      </div>)}
    </div>
  )
}

export default GroupList;