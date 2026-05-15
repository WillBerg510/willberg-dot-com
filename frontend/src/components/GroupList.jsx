const GroupList = (props) => {
  const {groupProjects, setOpenProject} = props;

  return (
    <div>
      {groupProjects.map(project => <div style={{display: "flex", width: "700px"}}>
        <img style={{cursor: "pointer"}} height="100" src={project.thumbnail} onClick={() => setOpenProject(project._id)} />
        <div>
          <h2 style={{textAlign: "left"}}>{project.name}</h2>
          <p style={{textAlign: "left"}}>{project.icon.toUpperCase()}</p>
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