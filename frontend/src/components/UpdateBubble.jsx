import { useState } from 'react';
import WillIcon from '../assets/Will.png';
import reactions from "../constants/reactions.js";

const UpdateBubble = (props) => {
  const { update, full, isAdmin, toggleReaction, deleteUpdate } = props;
  const [confirmDelete, setConfirmDelete] = useState();
  const [imageReady, setImageReady] = useState(false);

  // When delete button is clicked, wait 2 seconds for a second confirmation click
  const deleteClicked = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => {
        setConfirmDelete(false);
      }, 2000);
    }
    else deleteUpdate.mutate(update._id);
  }

  const onImageReady = () => {
    setImageReady(true);
  }

  return (
    <div style={imageReady ? {display: "flex"} : {display: "none"}} className={`updateRow${ full ? " updateRowFull" : " updateRowPreview"}`}>
      <div className="updateIcon">
        <img src={WillIcon} className="willIcon" onLoad={onImageReady} />
        <div className="updateTriangle" />
      </div>
      <div className="updateBubble">
        <div>
          <p className="updateDate">{update.date.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}</p>
          <p className="updateText">{imageReady} {update.text}</p>
          <div className="updateReactionsBar">
            {Object.entries(reactions).map(([reactionName, reactionEmoji]) => 
              <button
                className={`updateLowerButton${update.reacted[reactionName]
                  ? " updateReactionSelected"
                  : ""
                }`}
                onClick={() => toggleReaction(update, reactionName)} key={update._id + reactionName}>
                <p className="updateReactionEmoji">{reactionEmoji}</p>
                <p className="updateReactionNumber">{(update.reactionNums?.[reactionName] || 0) + (update.reacted?.[reactionName] || 0)}</p>
              </button>
            )}
          </div>
          {(isAdmin && full) && <button className="updateLowerButton updateDelete" onClick={() => deleteClicked(update)}>
            {confirmDelete ? "Confirm" : "Delete"}
          </button>}
        </div>
      </div>
    </div>
  )
}

export default UpdateBubble;