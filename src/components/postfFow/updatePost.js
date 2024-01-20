const handleUpdatePost = (postID, process, postFlow, setPostFlow) => {
  let updatedPosts = [];
  switch (process) {
    case "like":
      postFlow.forEach((postData) => {
        updatedPosts.push(
          postData.post?.postID === postID
            ? {
                post: {
                  ...postData.post,
                  isLiked: !postData.post.isLiked,
                  likeCount: postData.post.isLiked
                    ? postData.post.likeCount - 1
                    : postData.post.likeCount + 1,
                },
                user: { ...postData.user },
              }
            : postData
        );
      });
      break;
    case "save":
      postFlow.forEach((postData) => {
        updatedPosts.push(
          postData.post.postID === postID
            ? {
                post: { ...postData.post, isSaved: !postData.post.isSaved },
                user: { ...postData.user },
              }
            : postData
        );
      });
      break;
    default:
      updatedPosts = postFlow;
  }
  setPostFlow(updatedPosts);
};

const handleUpdateProfilePost = (postID, process, postFlow, setPostFlow) => {
  let updatedPosts = [];
  switch (process) {
    case "like":
      postFlow.forEach((post) => {
        updatedPosts.push(
          post?.postID === postID
            ? {
                ...post,
                isLiked: !post.isLiked,
                likeCount: post.isLiked
                  ? post.likeCount - 1
                  : post.likeCount + 1,
              }
            : post
        );
      });
      break;
    case "save":
      postFlow.forEach((post) => {
        updatedPosts.push(
          post.postID === postID ? { ...post, isSaved: !post.isSaved } : post
        );
      });
      break;
    default:
      updatedPosts = postFlow;
  }
  setPostFlow(updatedPosts);
};
export { handleUpdatePost, handleUpdateProfilePost };
