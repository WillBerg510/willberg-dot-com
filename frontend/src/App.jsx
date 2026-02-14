import './App.css'
import { useState, useEffect } from 'react';
import { BACKEND } from "./config.js";
import updatesAPI from "./api/UpdatesAPI.js";

function App() {
  const [update, setUpdate] = useState("");
  const [updates, setUpdates] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const reactions = {
    "heart": "❤️",
    "fire": "🔥",
    "surprise": "😯"
  };

  const postUpdate = () => {
    if (update != "") {
      updatesAPI.postUpdate(localStorage.getItem("auth_token"), update).then(() => {
        getUpdates();
        setUpdate("");
      });
    }
  };

  const getUpdates = () => {
    updatesAPI.getUpdates(localStorage.getItem("user_auth_token")).then(res => {
      res.data.updates.forEach((update) => {
        update.date = new Date(update.date);
      });
      setUpdates(res.data.updates);
    });
  };

  const refresh = () => {
    fetch(`${BACKEND}/admin/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
    }).then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error status: ${res.status}`);
      }
      return res.json();
    }).then(data => {
      setIsAdmin(data.token != "n/a");
      if (data.token != "n/a") localStorage.setItem("auth_token", data.token);
    }).catch(() => {
      setIsAdmin(false);
    });
  }

  const adminVerify = () => {
    fetch(`${BACKEND}/admin/verify`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
      }
    }).then(res => {
      if (!res.ok) {
        throw new Error(`Response status ${res.status}`);
      }
      return res.json();
    }).then(data => {
      setIsAdmin(data.admin);
      refresh();
    }).catch(() => {
      setIsAdmin(false);
    })
  }

  const userVerify = () => {
    fetch(`${BACKEND}/user/verify`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("user_auth_token")}`,
      }
    }).then(res => {
      if (!res.ok) {
        throw new Error(`Response status ${res.status}`);
      }
      return res.json();
    }).then(data => {
      if (data.valid) {
        getUpdates();
      }
      userRefresh();
    }).catch(error => {
      console.log(error);
    })
  }

  const getUser = () => {
    fetch(`${BACKEND}/user`, {
      credentials: 'include',
    }).then(res => {
      if (!res.ok) {
        throw new Error(`Response status ${res.status}`);
      }
      return res.json();
    }).then(data => {
      localStorage.setItem("user_auth_token", data.token);
      userRefresh();
      getUpdates();
    }).catch(error => {
      console.log(error);
    })
  }

  const userRefresh = () => {
    fetch(`${BACKEND}/user/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
    }).then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error status: ${res.status}`);
      }
      return res.json();
    }).then(data => {
      if (data.token != "n/a") {
        localStorage.setItem("user_auth_token", data.token);
        getUpdates();
      }
      else getUser();
    }).catch(() => {});
  }

  useEffect(() => {
    userVerify();
    adminVerify();
  }, []);

  const changeUpdate = (e) => {
    setUpdate(e.target.value);
  }

  const signOut = () => {
    localStorage.removeItem("auth_token");
    fetch(`${BACKEND}/admin/signout`, {
      method: "POST",
      credentials: "include",
    }).then(res => {
      if (!res.ok) {
        throw new Error(`Response status ${res.status}`);
      }
      return res.json();
    }).catch(error => {
      console.log(error);
    });
    getUpdates();
    setIsAdmin(false);
  }

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

  const deleteUpdate = (_id) => {
    updatesAPI.deleteUpdate(localStorage.getItem("auth_token"), _id).then(() => {
      getUpdates();
    });
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
