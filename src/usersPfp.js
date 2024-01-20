import axios from "axios";
import { getLink } from "./API";

const usersPfp = new Map();

const handleGetUserPfp = async (username) => {
  let picture = null;
  if (usersPfp.get(username)) {
    picture = usersPfp.get(username);
  } else {
    await axios
      .get(getLink.getUserPicture, { params: { username } })
      .then((res) => {
        picture = res.data?.picture;
        usersPfp.set(username, res.data?.picture);
      })
      .catch(() => {});
  }
  return picture;
};

const updateArrayPfp = async (username, setArray) => {
  const newPicture = await handleGetUserPfp(username);
  setArray((prevArray) => {
    const newArray = prevArray.map((item) => {
      if (item.user.username === username) {
        return {
          ...item,
          user: { ...item.user, picture: newPicture },
        };
      }
      return item;
    });
    return newArray;
  });
};

const updateUserListArrayPfp = async (username, setArray) => {
  const newPicture = await handleGetUserPfp(username);
  setArray((prevArray) => {
    const newArray = prevArray.map((item) => {
      if (item.username === username) {
        return {
          ...item,
          picture: newPicture,
        };
      }
      return item;
    });
    return newArray;
  });
};

const updateProfileArray = async (username, setUserData) => {
  const newPicture = await handleGetUserPfp(username);
  setUserData((prevState) => {
    return {
      ...prevState,
      picture: newPicture,
    };
  });
};

export {
  handleGetUserPfp,
  updateArrayPfp,
  updateUserListArrayPfp,
  updateProfileArray,
};
