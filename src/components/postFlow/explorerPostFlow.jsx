import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { getLink } from "../../API";
import PostComponent from "../post/postComponent";
import { handleUpdatePost } from "../postFlow/updatePost";

// ICON
import cameraLight from "../icon/light-mode/profile/camera.png";
import cameraDark from "../icon/dark-mode/profile/camera.png";

const ExplorerPostFlow = ({
  isDarkMode,
  handleCatchAxios,
  scrollingPercentage,
  setErrorCode,
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
    if (scrollingPercentage > 60) {
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
            setErrorCode={setErrorCode}
          />
        ))}
    </div>
  );
};

export default ExplorerPostFlow;