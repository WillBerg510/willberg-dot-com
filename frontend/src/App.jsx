import './App.css'
import { useState, useEffect } from 'react';
import updatesAPI from "./api/UpdatesAPI.js";
import adminAPI from "./api/AdminAPI.js";
import userAPI from "./api/UserAPI.js";

function App() {
  const [update, setUpdate] = useState("");
  const [updates, setUpdates] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const reactions = {
    "heart": "❤️",
    "fire": "🔥",
    "surprise": "😯"
  };

  // Verify whether the user's access tokens are valid upon page load, from which further setup actions are performed
  useEffect(() => {
    userVerify();
    adminVerify();
  }, []);

  // Add new update, clear update input, and get updated list
  const postUpdate = () => {
    if (update != "") {
      updatesAPI.postUpdate(localStorage.getItem("auth_token"), update).then(() => {
        getUpdates();
        setUpdate("");
      });
    }
  };

  // Get all updates
  const getUpdates = () => {
    updatesAPI.getUpdates(localStorage.getItem("user_auth_token")).then(res => {
      res.data.updates.forEach((update) => {
        update.date = new Date(update.date);
      });
      setUpdates(res.data.updates);
    });
  };

  // Attempt renewal of admin tokens, and revoke admin privileges if unsuccessful
  const refresh = () => {
    adminAPI.refresh().then(res => {
      setIsAdmin(res.data.token != "n/a");
      if (res.data.token != "n/a") localStorage.setItem("auth_token", res.data.token);
    });
  }

  // Determine whether the user's admin access token is valid, and then attempt a refresh with the refresh token
  const adminVerify = () => {
    adminAPI.verify(localStorage.getItem("auth_token")).then(res => {
      setIsAdmin(res.data.admin);
      refresh();
    });
  }

  // Determine whether the user's standard access token is valid, and then attempt a refresh with the refresh token
  const userVerify = () => {
    userAPI.verify(localStorage.getItem("user_auth_token")).then(res => {
      if (res.data.valid) {
        getUpdates();
      }
      userRefresh();
    });
  }

  // Acquire new user access token, and get all updates
  const getUser = () => {
    userAPI.getUser().then(res => {
      localStorage.setItem("user_auth_token", res.data.token);
      getUpdates();
    });
  }

  // Attempt renewal of user tokens, and get all updates if successful; otherwise, get a new user
  const userRefresh = () => {
    userAPI.refresh().then(res => {
      if (res.data.token != "n/a") {
        localStorage.setItem("user_auth_token", res.data.token);
        getUpdates();
      }
      else getUser();
    });
  }

  // Remove admin access token, remove admin refresh token, and revoke admin privileges
  const signOut = () => {
    localStorage.removeItem("auth_token");
    adminAPI.signOut().then(() => {
      setIsAdmin(false);
    });
  }

  // Either add or remove reaction based on its current state, and appropriately modify the reaction's appearance on the page
  const toggleReaction = (update, reaction) => {
    if (update.reacted[reaction]) {
      updatesAPI.removeReaction(localStorage.getItem("user_auth_token"), update._id, reaction);
    } else {
      updatesAPI.addReaction(localStorage.getItem("user_auth_token"), update._id, reaction);
    }
    setUpdates(updates.map(up => {
      if (update._id == up._id) {
        var newReacted = up.reacted;
        newReacted[reaction] = !up.reacted[reaction];
        return {...up, reacted: newReacted}
      }
      else return up;
    }));
  }

  // Delete update from its ID
  const deleteUpdate = (_id) => {
    updatesAPI.deleteUpdate(localStorage.getItem("auth_token"), _id).then(() => {
      getUpdates();
    });
  }

  // On change of update textarea
  const changeUpdate = (e) => {
    setUpdate(e.target.value);
  }

  return (
    <div id="app">
      {isAdmin &&
        <div>
          <h2>Logged in as admin</h2>
          <button onClick={signOut}>Sign Out</button>
        </div>
      }
      <h1>WELCOME TO THE WILL BERG WEBSITE</h1>
      <h2>THE PLACE TO BE</h2>
      <h3>Glad you could make it</h3>
      {isAdmin &&
        <div id="enterUpdate">
          <textarea onChange={changeUpdate} cols="50" rows="5" value={update} />
          <button id="postUpdate" onClick={postUpdate}>Post an update</button>
        </div>
      }
      {updates.toReversed().map((update, i) =>
        <div index={i} className="update">
          <h2 className="updateText">{update.text}</h2>
          <p className="updateDate">{update.date.toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}</p>
          {isAdmin &&
            <button className="deleteUpdate" onClick={() => deleteUpdate(update._id)}>Delete</button>
          }
          <div className="reactions">
            {Object.entries(reactions).map(([reactionName, reactionEmoji]) => 
              <button
                className="reaction"
                style={{
                  backgroundColor: update.reacted[reactionName] ? "lightgreen" : "lightgrey",
                }}
                onClick={() => toggleReaction(update, reactionName)}>
                {reactionEmoji} {(update.reactionNums?.[reactionName] || 0) + (update.reacted?.[reactionName] || 0)}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
