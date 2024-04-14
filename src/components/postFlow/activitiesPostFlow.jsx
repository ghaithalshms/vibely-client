import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { getLink } from "../../API";
import PostComponent from "../post/postComponent";
import { handleUpdatePost } from "../postFlow/updatePost";

// ICON
import cameraLight from "../icon/light-mode/profile/camera.png";
import cameraDark from "../icon/dark-mode/profile/camera.png";

const ActivitiesPostFlow = ({
  isDarkMode,
  handleCatchAxios,
  scrollingPercentage,
  setErrorCode,
}) => {
  const [postFlowArray, setPostFlowArray] = useState([]);
  const [lastGotPostID, setLastGotPostID] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const getAxiosLink = () => {
    const activityType = window.location.href
      .split("/")
      [window.location.href.split("/").length - 1].split("?")[0];
    switch (activityType) {
      case "liked":
        return getLink.getLikedPostFlow;
      case "saved":
        return getLink.getSavedPostFlow;
      case "archived":
        return getLink.getArchivedPostFlow;
      default:
        return null;
    }
  };

  const handleGetPostFlow = async (isOnScrolling) => {
    isPostFlowFetching = true;
    const axiosLink = getAxiosLink();
    if (!axiosLink) return;
    if (!isOnScrolling) setIsLoading(true);
    await axios
      .get(axiosLink, {
        params: {
          token: Cookies.get("token"),
          lastGotPostID,
        },
      })
      .then((response) => {
        if (
          response.data !== "no post flow" &&
          response.data?.lastGotPostID !== lastGotPostID
        ) {
          setLastGotPostID(response.data?.lastGotPostID);
          setPostFlowArray([...postFlowArray, ...response.data?.postFlowArray]);
        }
      })
      .catch((error) => handleCatchAxios(error));

    setIsLoading(false);
    isPostFlowGot = true;
    isPostFlowFetching = false;
  };

  let isPostFlowGot = false;

  useEffect(() => {
    if (!isPostFlowGot) {
      handleGetPostFlow();
    } else {
      setIsLoading(false);
    } // eslint-disable-next-line
  }, []);

  let isPostFlowFetching = false;

  useEffect(() => {
    if (!isPostFlowFetching)
      if (scrollingPercentage > 70) {
        handleGetPostFlow(true);
      } // eslint-disable-next-line
  }, [scrollingPercentage]);

  const Loader = () => (
    <div
      className="full-width"
      style={{ display: "flex", justifyContent: "center", paddingTop: "40vh" }}
    >
      <span className="loader" />
    </div>
  );

  const NoAnyPost = () => (
    <div
      className="container-x"
      style={{
        alignItems: "center",
        justifyContent: "center",
        marginTop: "40%",
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
      {isLoading && <Loader />}
      {!isLoading && postFlowArray.length === 0 && <NoAnyPost />}
      {postFlowArray.map((postData) => (
        <PostComponent
          isDarkMode={isDarkMode}
          key={postData.post.postID}
          user={postData.user}
          post={postData.post}
          postFlow={postFlowArray}
          setPostFlow={setPostFlowArray}
          handleUpdatePost={handleUpdatePost}
          handleCatchAxios={handleCatchAxios}
          setErrorCode={setErrorCode}
        />
      ))}
    </div>
  );
};

export default ActivitiesPostFlow;
