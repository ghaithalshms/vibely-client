const host = process.env.REACT_APP_API_URL;

const postLink = {
  // AUTH
  signIn: `${host}/api/auth/sign-in`,
  signUp: `${host}/api/auth/sign-up`,
  // USER
  checkUsername: `${host}/api/user/check-username`,
  follow: `${host}/api/user/follow`,
  // POST
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
  getUserFollowers: `${host}/api/user/followers`,
  getUserFollowing: `${host}/api/user/following`,
  // POST FLOW
  getHomePostFlow: `${host}/api/post-flow/home`,
  getUserPostFlow: `${host}/api/post-flow/user`,
  getExplorerPostFlow: `${host}/api/post-flow/explorer`,
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
