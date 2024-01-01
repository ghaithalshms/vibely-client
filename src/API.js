const host = process.env.REACT_APP_API_URL;

const postLink = {
  // AUTH
  signIn: `${host}/api/auth/sign-in`,
  signUp: `${host}/api/auth/sign-up`,
  // USER
  checkUsername: `${host}/api/user/check-username`,
  follow: `${host}/api/user/follow`,
  // POST
  createPost: `${host}/api/post/create`,
  likePost: `${host}/api/post/like`,
  savePost: `${host}/api/post/save`,
  // COMMENT
  likeComment: `${host}/api/comment/like`,
  createComment: `${host}/api/comment/create`,
};
const getLink = {
  // ACTIVATE SERVER
  activateServer: `${host}/api/server/activate`,
  // USER
  getUserData: `${host}/api/user/data`,
  getUserPicture: `${host}/api/user/data/picture`,
  getUserFollowers: `${host}/api/user/followers`,
  getUserFollowing: `${host}/api/user/following`,
  getSearchUser: `${host}/api/user/search`,
  // POST FLOW
  getHomePostFlow: `${host}/api/post-flow/home`,
  getUserPostFlow: `${host}/api/post-flow/user`,
  getExplorerPostFlow: `${host}/api/post-flow/explorer`,
  getLikedPostFlow: `${host}/api/post-flow/liked`,
  getSavedPostFlow: `${host}/api/post-flow/saved`,
  getArchivedPostFlow: `${host}/api/post-flow/archived`,
  // POST
  getPostComments: `${host}/api/post/comments`,
  getPostLikedUsers: `${host}/api/post/liked-users`,
};

const deleteLink = {
  // POST
  deletePost: `${host}/api/post/delete`,
  // COMMENT
  deleteComment: `${host}/api/comment/delete`,
};

const updateLink = {
  // POST
  archivePost: `${host}/api/post/archive`,
};

export { postLink, getLink, deleteLink, updateLink };
