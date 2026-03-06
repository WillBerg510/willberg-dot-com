import '../stylesheets/App.css'
import '../stylesheets/fonts.css'
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import updatesAPI from "../api/UpdatesAPI.js";
import adminAPI from "../api/AdminAPI.js";
import userAPI from "../api/UserAPI.js";
import UpdatesBox from '../components/UpdatesBox.jsx';

function App() {
  const [update, setUpdate] = useState("");
  const [updates, setUpdates] = useState([]);
  const [isAdminn, setIsAdmin] = useState(false);
  const [allUpdatesOpen, setAllUpdatesOpen] = useState(false);
  const [userVerifyFailed, setUserVerifyFailed] = useState(false);
  const client = useQueryClient();

  // Verify whether the user's access tokens are valid upon page load, from which further setup actions are performed
  useEffect(() => {
    userVerify();
  }, []);

  // Add new update and clear update input
  const postUpdate = useMutation({
    mutationFn: () => (update != "") ? updatesAPI.postUpdate(localStorage.getItem("auth_token"), update) : null,
    onSuccess: () => {
      client.invalidateQueries(["updates"]);
      setUpdate("");
    }
  });

  // Get all updates
  const getUpdates = useQuery({
    queryKey: ["updates"],
    queryFn: () => {
      return updatesAPI.getUpdates().then(res => {
        res.data.updates.forEach((update) => {
          update.date = new Date(update.date);
        });
        return res.data.updates.toReversed();
      });
    },
  });
  useEffect(() => {
    if (getUpdates.error?.response.status == 500) {
      userRefresh(true);
    }
    setUpdates(getUpdates.data);
  }, [getUpdates]);

  // Either add or remove reaction based on its current state, and appropriately modify the reaction's appearance on the page
  const addReaction = useMutation({
    mutationFn: ({update, reaction}) => updatesAPI.addReaction(localStorage.getItem("user_auth_token"), update._id, reaction),
    retry: (count, error) => {
      if (error.response.status == 500 && count < 1) {
        userRefresh(false);
        return true;
      }
      return false;
    }
  });

  const removeReaction = useMutation({
    mutationFn: ({update, reaction}) => updatesAPI.removeReaction(localStorage.getItem("user_auth_token"), update._id, reaction),
    retry: (count, error) => {
      if (error.response.status == 500 && count < 1) {
        userRefresh(false);
        return true;
      }
      return false;
    }
  });

  const toggleReaction = (update, reaction) => {
    setUpdates(updates.map(up => {
      if (update._id == up._id) {
        var newReacted = up.reacted;
        newReacted[reaction] = !up.reacted[reaction];
        return {...up, reacted: newReacted}
      }
      else return up;
    }));
    if (update.reacted[reaction]) {
      addReaction.mutate({update, reaction});
    } else {
      removeReaction.mutate({update, reaction});
    }
  }

  // Delete update from its ID
  const deleteUpdate = useMutation({
    mutationFn: (_id) => updatesAPI.deleteUpdate(localStorage.getItem("auth_token"), _id),
    onSuccess: () => {
      client.invalidateQueries(["updates"]);
    }
  });

  // Attempt renewal of admin tokens, and revoke admin privileges if unsuccessful
  const refresh = () => {
    adminAPI.refresh().then(res => {
      setIsAdmin(res.data.token != "n/a");
      if (res.data.token != "n/a") localStorage.setItem("auth_token", res.data.token);
    });
  }

  // Determine whether the user's admin access token is valid, and then attempt a refresh with the refresh token
  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin"],
    queryFn: () => adminAPI.verify().then(res => {
      return res.data;
    }),
  });

  // Determine whether the user's standard access token is valid, and then attempt a refresh with the refresh token
  const { mutate: userVerify } = useMutation({
    mutationFn: () => userAPI.verify().then(res => {
      if (!res) {
        setUserVerifyFailed(true);
      }
      else {
        setUserVerifyFailed(false);
        client.invalidateQueries(["updates"]);
        userRefresh(true);
      }
    }),
  });

  // Acquire new user access token, and get all updates
  const getUser = () => {
    userAPI.getUser().then(res => {
      client.invalidateQueries(["updates"]);
    });
  }

  // Attempt renewal of user tokens, and get all updates if successful; otherwise, get a new user
  const userRefresh = (getUpdates) => {
    userAPI.refresh().then(res => {
      if (res.data.token != "n/a") {
        localStorage.setItem("user_auth_token", res.data.token);
        if (getUpdates) client.invalidateQueries(["updates"]);
      }
      else getUser();
    });
  }

  // Remove admin access token, remove admin refresh token, and revoke admin privileges
  const { mutate: signOut } = useMutation({
    mutationFn: adminAPI.signOut,
    onSuccess: () => client.invalidateQueries(["isAdmin"]),
  });

  const toggleSeeMore = () => {
    if (allUpdatesOpen) {
      setAllUpdatesOpen(false);
      document.body.style.overflowY = "visible";
      document.body.style.overscrollBehavior = "auto";
    } else {
      setAllUpdatesOpen(true);
      document.body.style.overflowY = "hidden";
      document.body.style.overscrollBehavior = "none";
    }
    client.invalidateQueries(["updates"]);
  }

  // On change of update textarea
  const changeUpdate = (e) => {
    setUpdate(e.target.value);
  }

  return (
    <div id="app">
      {isAdmin &&
        <div style={{display: "flex", gap: "10px", height: "36px", alignItems: "center"}}>
          <h2 style={{margin: "0"}}>Logged in as admin</h2>
          <button style={{margin: "0"}} onClick={signOut}>Sign Out</button>
        </div>
      }
      <h1 className="mainHeading">WILL BERG</h1>
      <h2 className="mainSubtitle">AND THE WEBSITE ON THE INTERNET</h2>
      {isAdmin &&
        <div id="enterUpdate">
          <textarea onChange={changeUpdate} cols="50" rows="5" value={update} />
          <button id="postUpdate" onClick={postUpdate.mutate} style={{marginBottom: "30px"}}>Post an update</button>
        </div>
      }
      {/*<UpdatesBox updates={updates} toggleReaction={toggleReaction} isAdmin={isAdmin} full={false} toggleSeeMore={toggleSeeMore} deleteUpdate={deleteUpdate} userVerifyFailed={userVerifyFailed} getUpdates={getUpdates} />
      {allUpdatesOpen && <div className="windowOnTop" onClick={toggleSeeMore}>
        <UpdatesBox updates={updates} toggleReaction={toggleReaction} isAdmin={isAdmin} full={true} toggleSeeMore={toggleSeeMore} deleteUpdate={deleteUpdate} userVerifyFailed={userVerifyFailed} getUpdates={getUpdates} />
      </div>}*/}
    </div>
  )
}

export default App
