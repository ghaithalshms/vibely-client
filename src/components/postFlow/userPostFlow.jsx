import React from "react";
import Cookies from "js-cookie";
import PostComponent from "../post/postComponent";
import { handleUpdateProfilePost } from "../postFlow/updatePost";

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
  setErrorCode,
  isPostFlowLoading,
  userPostFlowArray,
  setUserPostFlowArray,
}) => {
  if (isPostFlowLoading) {
    return (
      <div
        className="full-width"
        style={{ display: "flex", justifyContent: "center", paddingTop: "30%" }}
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
        marginTop: "33%",
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

      {!isPostFlowLoading &&
        userPostFlowArray?.length === 0 &&
        (!userData.privacity ||
          userData.username === Cookies.get("username") ||
          userData.isFollowing) &&
        noAnyPost}

      {Array.isArray(userPostFlowArray) &&
        userPostFlowArray?.map((post) => (
          <PostComponent
            isDarkMode={isDarkMode}
            key={post.postID}
            user={userData}
            post={post}
            postFlow={userPostFlowArray}
            visitUser={visitUser}
            handleUpdatePost={handleUpdateProfilePost}
            handleCatchAxios={handleCatchAxios}
            setErrorCode={setErrorCode}
            setPostFlow={setUserPostFlowArray}
          />
        ))}
    </div>
  );
};

export default UserPostFlow;
