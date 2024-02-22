import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { getLink } from "../../API";
import PostComponent from "../post/postComponent";
import { handleUpdatePost } from "../postfFow/updatePost";

// ICON
import cameraLight from "../icon/light-mode/profile/camera.png";
import cameraDark from "../icon/dark-mode/profile/camera.png";

const HomePostFlow = ({
  isDarkMode,
  handleCatchAxios,
  scrollingPercentage,
}) => {
  const [homePostFlowArray, setHomePostFlowArray] = useState([]);
  const [lastGotPostID, setLastGotPostID] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPostFlowGot, setIsPostFlowGot] = useState(false);

  const handleGetHomePostFlow = async (isOnScrolling) => {
    if (!isOnScrolling) setIsLoading(true);
    if (lastGotPostID >= 0)
      await axios
        .get(getLink.getHomePostFlow, {
          params: {
            token: Cookies.get("token"),
            lastGotPostID,
          },
        })
        .then(async (res) => {
          if (res.data !== "no post flow") {
            setLastGotPostID(res.data?.lastGotPostID);
            if (!isOnScrolling) setHomePostFlowArray(res.data?.postFlowArray);
            // ADD THE NEW POST FLOW ARRAY TO THE OLD ONE
            else
              setHomePostFlowArray([
                ...homePostFlowArray,
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
    if (!isPostFlowGot) handleGetHomePostFlow();
    else setIsLoading(false);
    // eslint-disable-next-line
  }, []);

  // GET USER POST FLOW ON SCROLL EVENT
  useEffect(() => {
    if (scrollingPercentage > 60) {
      handleGetHomePostFlow(true);
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
          paddingTop: "30vh",
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
      {!isLoading && homePostFlowArray?.length === 0 && noAnyPost}
      {Array.isArray(homePostFlowArray) &&
        homePostFlowArray?.map((postData) => (
          <PostComponent
            isDarkMode={isDarkMode}
            key={postData.post.postID}
            user={postData.user}
            post={postData.post}
            postFlow={homePostFlowArray}
            setPostFlow={setHomePostFlowArray}
            handleUpdatePost={handleUpdatePost}
            handleCatchAxios={handleCatchAxios}
          />
        ))}
    </div>
  );
};

export default HomePostFlow;
