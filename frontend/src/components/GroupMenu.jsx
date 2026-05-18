import projectGroups from "../constants/projectGroups.js";

const GroupMenu = (props) => {
  const {getGroupProjects} = props;

  const selectGroup = (e) => {
    getGroupProjects(e.currentTarget.name);
  }

  return (
    <div>
      <button name={""} onClick={selectGroup}>None</button>
      {Object.entries(projectGroups).map(([group, groupObj]) => <button key={group} name={group} onClick={selectGroup}>
        <img height="90" src={groupObj.icon} />
        <p/>
        {groupObj.name}
      </button>)}
    </div>
  )
}

export default GroupMenu;