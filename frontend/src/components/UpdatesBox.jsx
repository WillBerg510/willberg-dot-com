import '../stylesheets/UpdatesBox.css';
import { useRef, useState, useEffect } from 'react';
import UpdateBubble from './UpdateBubble.jsx';

const UpdatesBox = (props) => {
  const { updates, toggleReaction, isAdmin, full, toggleSeeMore, deleteUpdate, userVerifyFailed, getUpdates } = props;
  const boxRef = useRef(null);
  const [expanded, setExpanded] = useState(full);
  const [showGradient, setShowGradient] = useState(false);

  const expandPreview = () => {
    setExpanded(true);
  }

  const receiveClick = (e) => {
    e.stopPropagation();
  }

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      setShowGradient(boxRef.current?.scrollHeight > boxRef.current?.offsetHeight);
    });

    resizeObserver.observe(boxRef?.current);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowGradient(boxRef.current?.scrollHeight > boxRef.current?.offsetHeight);
    }, 200);
  }, [updates]);

  return (
    <div className={`updatesBoxAndButton${full ? " updatesBoxAndButtonFull" : ""}`} onClick={receiveClick}>
      <div ref={boxRef}
        onClick={expandPreview}
        className={`updatesBox
          ${full ? " updatesBoxFull" : ""}
          ${!expanded ? " updatesBoxCollapsed" : ""}
          ${(!expanded && showGradient) ? " updatesBoxClickable" : ""}
        `}
      >
        <h2 className="updatesHeader">{full ? "WILL'S UPDATES" : "LATEST UPDATES"}</h2>
        {(!expanded) && (<div className={`updatesBoxOverflow ${showGradient ? "" : "transparent"}`} />)}
        {userVerifyFailed && <p className="updatesBoxInfo">Unable to connect with backend server.</p>}
        {getUpdates.isLoading && <p className="updatesBoxInfo">Loading...</p>}
        {(full ? updates : updates?.slice(0, 1))?.map((update) => (
          <UpdateBubble full={full} update={update} isAdmin={isAdmin} toggleReaction={toggleReaction} deleteUpdate={deleteUpdate} />
        ))}
      </div>
      {!full && (<div className="updatesButton" onClick={toggleSeeMore}>
        <p className="updatesButtonText">SEE MORE</p>
      </div>)}
      {full && (<div className="updatesButton updatesClose" onClick={toggleSeeMore}>
        <p className="updatesButtonText updatesCloseText">CLOSE</p>
      </div>)}
    </div>
  );
}

export default UpdatesBox;