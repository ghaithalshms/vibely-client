import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { getLink } from "../../API";
import PostComponent from "../post/postComponent";
import { handleUpdateProfilePost } from "../postfFow/updatePost";

// ICON
import cameraLight from "../icon/light-mode/profile/camera.png";
import cameraDark from "../icon/dark-mode/profile/camera.png";
import privateLight from "../icon/light-mode/profile/private.png";
import privateDark from "../icon/dark-mode/profile/private.png";

const UserPostFlow = ({
  isDarkMode,
  userData,
  visitUser,
  handleCatchAxios,
  scrollingPercentage,
}) => {
  const [userPostFlowArray, setUserPostFlowArray] = useState();
  const [lastGotPostID, setLastGotPostID] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPostFlowGot, setIsPostFlowGot] = useState(false);

  const handleGetUserPostFlow = async (isOnScrolling) => {
    if (!isOnScrolling) setIsLoading(true);
    await axios
      .get(getLink.getUserPostFlow, {
        params: {
          username: userData.username,
          token: Cookies.get("token"),
          lastGotPostID,
        },
      })
      .then((res) => {
        if (res?.data !== "private account") {
          setLastGotPostID(res.data?.lastGotPostID);
          if (!isOnScrolling) setUserPostFlowArray(res.data?.postFlowArray);
          // ADD THE NEW POST FLOW ARRAY TO THE OLD ONE
          else
            setUserPostFlowArray([
              ...userPostFlowArray,
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
    if (
      !isPostFlowGot &&
      (userData.username === Cookies.get("username") ||
        userData.isFollowing ||
        !userData.privacity)
    )
      handleGetUserPostFlow();
    else {
      setIsLoading(false);
    }
    // eslint-disable-next-line
  }, []);

  // GET USER POST FLOW ON SCROLL EVENT
  useEffect(() => {
    if (
      scrollingPercentage > 60 &&
      userData?.postCount > userPostFlowArray?.length
    ) {
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

  const privateAccount = (
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
        src={isDarkMode ? privateDark : privateLight}
        alt="private"
      />
      <h3 style={{ marginTop: "10px" }}>This account is private</h3>
    </div>
  );

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
      {userData.username !== Cookies.get("username") &&
        !userData.isFollowing &&
        userData.privacity &&
        privateAccount}
      {!isLoading &&
        userPostFlowArray?.length === 0 &&
        (!userData.privacity ||
          userData.username === Cookies.get("username")) &&
        noAnyPost}
      {Array.isArray(userPostFlowArray) &&
        userPostFlowArray?.map((post) => (
          <PostComponent
            isDarkMode={isDarkMode}
            key={post.postID}
            user={userData}
            post={post}
            postFlow={userPostFlowArray}
            setPostFlow={setUserPostFlowArray}
            visitUser={visitUser}
            handleUpdatePost={handleUpdateProfilePost}
            handleCatchAxios={handleCatchAxios}
          />
        ))}
    </div>
  );
};

export default UserPostFlow;
