import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { getLink } from "../../API";
import PostComponent from "../post/postComponent";
import { updateArrayPfp } from "../../usersPfp";
import { handleUpdatePost } from "../postfFow/updatePost";

// ICON
import cameraLight from "../icon/light-mode/profile/camera.png";
import cameraDark from "../icon/dark-mode/profile/camera.png";
import { updatePostFlowFile } from "./getPostFile";

const ExplorerPostFlow = ({
  isDarkMode,
  handleCatchAxios,
  scrollingPercentage,
}) => {
  const [explorerPostFlowArray, setExplorerPostFlowArray] = useState([]);
  const [lastGotPostID, setLastGotPostID] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPostFlowGot, setIsPostFlowGot] = useState(false);

  const handleGetUserPostFlow = async (isOnScrolling) => {
    if (!isOnScrolling) setIsLoading(true);
    if (lastGotPostID >= 0)
      await axios
        .get(getLink.getExplorerPostFlow, {
          params: {
            token: Cookies.get("token"),
            lastGotPostID,
          },
        })
        .then(async (res) => {
          if (res.data !== "no post flow") {
            setLastGotPostID(res.data?.lastGotPostID);
            if (!isOnScrolling)
              setExplorerPostFlowArray(res.data?.postFlowArray);
            // ADD THE NEW POST FLOW ARRAY TO THE OLD ONE
            else
              setExplorerPostFlowArray([
                ...explorerPostFlowArray,
                ...res.data?.postFlowArray,
              ]);
            for (const postData of res.data?.postFlowArray) {
              const username = postData.user.username;
              updateArrayPfp(username, setExplorerPostFlowArray);
              const postID = postData.post.postID;
              updatePostFlowFile(postID, setExplorerPostFlowArray);
            }
          }
        })
        .catch((err) => handleCatchAxios(err));
    setIsLoading(false);
    setIsPostFlowGot(true);
  };

  useEffect(() => {
    // GET USER POST FLOW ON LOAD
    if (!isPostFlowGot) handleGetUserPostFlow();
    else setIsLoading(false);
    // eslint-disable-next-line
  }, []);

  // GET USER POST FLOW ON SCROLL EVENT
  useEffect(() => {
    if (scrollingPercentage > 75) {
      handleGetUserPostFlow(true);
    }
    // eslint-disable-next-line
  }, [scrollingPercentage]);

  if (isLoading) {
    return (
      <div
        className="full-width"
        style={{
          position: "fixed",
          top: "45%",
          left: "45%",
        }}
      >
        <span className="loader" />
      </div>
    );
  }

  const noAnyPost = (
    <div
      className="container-x"
      style={{
        alignItems: "center",
        justifyContent: "center",
        marginTop: "30vh",
      }}
    >
      <img
        style={{ width: "45px", marginRight: "10px" }}
        src={isDarkMode ? cameraDark : cameraLight}
        alt="private"
      />
      <h3 style={{ marginTop: "10px" }}>There's nothing to see</h3>
    </div>
  );

  return (
    <div className="container-y post-container">
      {!isLoading && explorerPostFlowArray?.length === 0 && noAnyPost}
      {Array.isArray(explorerPostFlowArray) &&
        explorerPostFlowArray?.map((postData) => (
          <PostComponent
            isDarkMode={isDarkMode}
            key={postData.post.postID}
            user={postData.user}
            post={postData.post}
            postFlow={explorerPostFlowArray}
            setPostFlow={setExplorerPostFlowArray}
            handleUpdatePost={handleUpdatePost}
            handleCatchAxios={handleCatchAxios}
          />
        ))}
    </div>
  );
};

export default ExplorerPostFlow;
