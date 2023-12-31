import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { getLink } from "../../API";
import PostComponent from "./post/postComponent";

// ICON
import cameraLight from "../icon/light-mode/profile/camera.png";
import cameraDark from "../icon/dark-mode/profile/camera.png";

const ExplorerPostFlow = ({
  isDarkMode,
  handleCatchAxios,
  scrollingPercentage,
}) => {
  const [explorerPostFlowArray, setExplorerPostFlowArray] = useState();
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
        .then((res) => {
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

  const handleUpdatePost = (postID, process) => {
    let updatedPosts = [];
    switch (process) {
      case "like":
        explorerPostFlowArray.forEach((postData) => {
          updatedPosts.push(
            postData.post.postID === postID
              ? {
                  ...postData,
                  isLiked: !postData.post.isLiked,
                  likeCount: postData.post.isLiked
                    ? postData.post.likeCount - 1
                    : postData.post.likeCount + 1,
                }
              : postData
          );
        });
        break;
      case "save":
        explorerPostFlowArray.forEach((postData) => {
          updatedPosts.push(
            postData.post.postID === postID
              ? { ...postData, isSaved: !postData.post.isSaved }
              : postData
          );
        });
        break;
      default:
        updatedPosts = explorerPostFlowArray;
    }
    setExplorerPostFlowArray(updatedPosts);
  };

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
          display: "flex",
          justifyContent: "center",
          paddingTop: "30%",
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
        marginTop: "5rem",
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
            handleUpdatePost={handleUpdatePost}
            handleCatchAxios={handleCatchAxios}
          />
        ))}
    </div>
  );
};

export default ExplorerPostFlow;
