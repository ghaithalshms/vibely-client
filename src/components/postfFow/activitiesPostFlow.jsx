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

const ActivitiesPostFlow = ({
  isDarkMode,
  handleCatchAxios,
  scrollingPercentage,
}) => {
  const [postFlowArray, setPostFlowArray] = useState();
  const [lastGotPostID, setLastGotPostID] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPostFlowGot, setIsPostFlowGot] = useState(false);

  const getAxiosLink = () => {
    const activityType =
      window.location.href.split("/")[
        window.location.href.split("/").length - 1
      ];
    switch (activityType) {
      case "liked":
        return getLink.getLikedPostFlow;
      case "saved":
        return getLink.getSavedPostFlow;
      case "archived":
        return getLink.getArchivedPostFlow;
      default:
        break;
    }
  };

  const handleGetPostFlow = async (isOnScrolling) => {
    const axiosLink = getAxiosLink();
    if (!axiosLink) return;
    if (!isOnScrolling) setIsLoading(true);
    if (lastGotPostID >= 0)
      await axios
        .get(axiosLink, {
          params: {
            token: Cookies.get("token"),
            lastGotPostID,
          },
        })
        .then((res) => {
          if (res.data !== "no post flow") {
            setLastGotPostID(res.data?.lastGotPostID);
            if (!isOnScrolling) setPostFlowArray(res.data?.postFlowArray);
            // ADD THE NEW POST FLOW ARRAY TO THE OLD ONE
            else
              setPostFlowArray([...postFlowArray, ...res.data?.postFlowArray]);
            for (const postData of res.data?.postFlowArray) {
              const username = postData.user.username;
              updateArrayPfp(username, setPostFlowArray);
              const postID = postData.post.postID;
              updatePostFlowFile(postID, setPostFlowArray);
            }
          }
        })
        .catch((err) => handleCatchAxios(err));
    setIsLoading(false);
    setIsPostFlowGot(true);
  };

  useEffect(() => {
    // GET USER POST FLOW ON LOAD
    if (!isPostFlowGot) handleGetPostFlow();
    else setIsLoading(false);
    // eslint-disable-next-line
  }, []);

  // GET USER POST FLOW ON SCROLL EVENT
  useEffect(() => {
    if (scrollingPercentage > 75) {
      handleGetPostFlow(true);
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
          paddingTop: "40svh",
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
      {!isLoading && postFlowArray?.length === 0 && noAnyPost}
      {Array.isArray(postFlowArray) &&
        postFlowArray?.map((postData) => (
          <PostComponent
            isDarkMode={isDarkMode}
            key={postData.post.postID}
            user={postData.user}
            post={postData.post}
            postFlow={postFlowArray}
            setPostFlow={setPostFlowArray}
            handleUpdatePost={handleUpdatePost}
            handleCatchAxios={handleCatchAxios}
          />
        ))}
    </div>
  );
};

export default ActivitiesPostFlow;
