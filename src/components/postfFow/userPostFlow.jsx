import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { getLink } from "../../API";
import PostComponent from "./post/postComponent";

const UserPostFlow = ({ isDarkMode, userData, visitUser }) => {
  const [userPostFlowArray, setUserPostFlowArray] = useState();
  const [lastGotPostID, setLastGotPostID] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const handleGetUserPostFlow = async () => {
    setIsLoading(true);
    await axios
      .get(getLink.getUserPostFlow, {
        params: {
          username: userData.username,
          token: Cookies.get("token"),
          lastGotPostID,
        },
      })
      .then((res) => {
        setLastGotPostID(res.data?.lastGotPostID);
        setUserPostFlowArray(res.data?.postFlowArray);
      });
    setIsLoading(false);
  };
  useEffect(() => {
    handleGetUserPostFlow();
  }, []);

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

  return (
    <div className="container-y post-container">
      {userPostFlowArray.map((post) => (
        <PostComponent
          isDarkMode={isDarkMode}
          key={post.postID}
          user={userData}
          post={post}
          visitUser={visitUser}
        />
      ))}
    </div>
  );
};

export default UserPostFlow;
