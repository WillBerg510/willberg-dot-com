import '../stylesheets/UpdatesBox.css';
import { useRef, useState, useEffect } from 'react';

const UpdatesBox = (props) => {
  const { updates, reactions, toggleReaction, isAdmin, full, setAllUpdatesOpen, deleteUpdate } = props;
  const boxRef = useRef(null);
  const [expanded, setExpanded] = useState(full);
  const [screenChange, setScreenChange] = useState(0);

  const expandPreview = () => {
    setExpanded(true);
  }

  const receiveClick = (e) => {
    e.stopPropagation();
  }

  useEffect(() => {
    var i = 0;
    const onScreenChange = () => {
      setScreenChange(i + 1);
      i = i + 1;
    }
    
    window.addEventListener("resize", onScreenChange);
    return () => {
      window.removeEventListener("resize", onScreenChange);
    }
  }, []);

  return (
    <div className={`updatesBoxAndButton${full ? " updatesBoxAndButtonFull" : ""}`} onClick={receiveClick}>
      <div ref={boxRef}
        onClick={expandPreview}
        className={`updatesBox
          ${full ? " updatesBoxFull" : ""}
          ${!expanded ? " updatesBoxCollapsed" : ""}
          ${(!expanded && boxRef.current?.scrollHeight > boxRef.current?.offsetHeight) ? " updatesBoxClickable" : ""}
        `}
      >
        <h2 className="updatesHeader">{full ? "WILL'S UPDATES" :"LATEST UPDATES"}</h2>
        {(!expanded && boxRef.current?.scrollHeight > boxRef.current?.offsetHeight) && (<div className="updatesBoxOverflow" />)}
        {(full ? updates : updates.slice(0, 1)).map((update, index) => (
          <div className={`updateRow${ full ? " updateRowFull" : " updateRowPreview"}`} key={index}>
            <div className="updateIcon">
              <img src="/Will.png" className="willIcon" />
              <div className="updateTriangle"></div>
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
                <p className="updateText">{update.text}</p>
                <div className="updateReactionsBar">
                  {Object.entries(reactions).map(([reactionName, reactionEmoji]) => 
                    <button
                      className={`updateLowerButton${update.reacted[reactionName]
                        ? " updateReactionSelected"
                        : ""
                      }`}
                      onClick={() => toggleReaction(update, reactionName)} key={index + reactionName}>
                      <p className="updateReactionEmoji">{reactionEmoji}</p>
                      <p className="updateReactionNumber">{(update.reactionNums?.[reactionName] || 0) + (update.reacted?.[reactionName] || 0)}</p>
                    </button>
                  )}
                </div>
                {isAdmin && <button className="updateLowerButton updateDelete" onClick={() => deleteUpdate(update._id)}>
                  Delete
                </button>}
              </div>
            </div>
          </div>
        ))}
      </div>
      {!full && (<div className="updatesButton" onClick={() => {setAllUpdatesOpen(true)}}>
        <p className="updatesButtonText">SEE MORE</p>
      </div>)}
      {full && (<div className="updatesButton updatesClose" onClick={() => {setAllUpdatesOpen(false)}}>
        <p className="updatesButtonText updatesCloseText">CLOSE</p>
      </div>)}
    </div>
  );
}

export default UpdatesBox;