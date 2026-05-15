import projectGroups from "../constants/projectGroups.js";

const GroupMenu = (props) => {
  const {getGroupProjects} = props;

  const selectGroup = (e) => {
    getGroupProjects(e.target.name);
  }

  return (
    <div>
      <button name={""} onClick={selectGroup}>None</button>
      {Object.entries(projectGroups).map(([group, groupName]) => <button key={group} name={group} onClick={selectGroup}>
        {groupName}
      </button>)}
    </div>
  )
}

export default GroupMenu;