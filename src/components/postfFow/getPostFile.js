import axios from "axios";
import { getLink } from "../../API";
import Cookies from "js-cookie";

const handleGetPostFile = async (postID) => {
  let file = null;
  await axios
    .get(getLink.getPostFile, {
      params: { postID, token: Cookies.get("token") },
    })
    .then((res) => {
      file = res.data?.file;
    })
    .catch(() => {});
  return file;
};

const updatePostFlowFile = async (postID, setPostFlowArray) => {
  const newFile = await handleGetPostFile(postID);
  setPostFlowArray((prevArray) => {
    const newArray = prevArray.map((postData) => {
      if (postData?.post?.postID === postID) {
        return {
          ...postData,
          post: { ...postData.post, file: newFile },
        };
      } else if (postData?.postID === postID) {
        return {
          ...postData,
          file: newFile,
        };
      }
      return postData;
    });
    return newArray;
  });
};

export { updatePostFlowFile };
