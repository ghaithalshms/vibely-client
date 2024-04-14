import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { getLink } from "../../API";
import PostComponent from "../post/postComponent";
import { handleUpdatePost } from "../postFlow/updatePost";

// ICON
import cameraLight from "../icon/light-mode/profile/camera.png";
import cameraDark from "../icon/dark-mode/profile/camera.png";

const HomePostFlow = ({
  isDarkMode,
  handleCatchAxios,
  scrollingPercentage,
  setErrorCode,
}) => {
  const [homePostFlowArray, setHomePostFlowArray] = useState([]);
  const [lastGotPostID, setLastGotPostID] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const handleGetHomePostFlow = async (isOnScrolling) => {
    isPostFlowFetching = true;

    setIsLoading(true);
    await axios
      .get(getLink.getHomePostFlow, {
        params: {
          token: Cookies.get("token"),
          lastGotPostID,
        },
      })
      .then((response) => {
        const { lastGotPostID: newLastGotPostID, postFlowArray } =
          response.data;
        if (
          response.data !== "no post flow" &&
          newLastGotPostID !== lastGotPostID
        ) {
          setLastGotPostID(newLastGotPostID);
          setHomePostFlowArray((prevPostFlowArray) => [
            ...prevPostFlowArray,
            ...postFlowArray,
          ]);
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
      handleGetHomePostFlow(false);
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line
  }, []);

  let isPostFlowFetching = false;

  useEffect(() => {
    if (!isPostFlowFetching)
      if (scrollingPercentage > 70) {
        handleGetHomePostFlow(true);
      }
    // eslint-disable-next-line
  }, [scrollingPercentage]);

  const Loader = () => (
    <div
      className="full-width"
      style={{ display: "flex", justifyContent: "center", paddingTop: "20vh" }}
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
      {isLoading && <Loader />}
      {!isLoading && homePostFlowArray.length === 0 && <NoAnyPost />}
      {homePostFlowArray.map((postData) => (
        <PostComponent
          isDarkMode={isDarkMode}
          key={postData.post.postID}
          user={postData.user}
          post={postData.post}
          postFlow={homePostFlowArray}
          setPostFlow={setHomePostFlowArray}
          handleUpdatePost={handleUpdatePost}
          handleCatchAxios={handleCatchAxios}
          setErrorCode={setErrorCode}
        />
      ))}
    </div>
  );
};

export default HomePostFlow;
