const host = process.env.REACT_APP_API_URL;

const postLink = {
  // AUTH
  signIn: `${host}/api/auth/sign-in`,
  signUp: `${host}/api/auth/sign-up`,
  // USER
  checkUsername: `${host}/api/user/check-username`,
  follow: `${host}/api/user/follow`,
  acceptFollowRequest: `${host}/api/user/follow/request/accept`,
  // POST
  createPost: `${host}/api/post/create`,
  likePost: `${host}/api/post/like`,
  savePost: `${host}/api/post/save`,
  // COMMENT
  likeComment: `${host}/api/comment/like`,
  createComment: `${host}/api/comment/create`,
  // CHAT
  sendMessageToDB: `${host}/api/chat/send-message`,
  // WEB PUSH NOTIFICATION
  subscribeWebPush: `${host}/api/notification/subscribe`,
};
const getLink = {
  // APP
  appVersion: `${host}/api/app/version`,
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
  // NOTIFICATION
  getNotification: `${host}/api/notification`,
  getNotificationCount: `${host}/api/notification/count`,
  // INBOX
  getInbox: `${host}/api/inbox`,
  getMessagesCount: `${host}/api/inbox/count`,
  // CHAT
  getChat: `${host}/api/chat`,
  // SUGGESTIONS
  getSuggestions: `${host}/api/suggestions`,
};

const deleteLink = {
  // POST
  deletePost: `${host}/api/post/delete`,
  // COMMENT
  deleteComment: `${host}/api/comment/delete`,
  // USER
  deleteFollowRequest: `${host}/api/user/follow/request/delete`,
  // WEB PUSH NOTIFICATIONS
  unsubscribeWebPush: `${host}/api/notification/unsubscribe`,
};

const updateLink = {
  // AUTH
  forgotPassword: `${host}/api/auth/forgot-password`,
  resetPassword: `${host}/api/auth/reset-password`,
  // POST
  archivePost: `${host}/api/post/archive`,
  unarchivePost: `${host}/api/post/unarchive`,
  // USER
  updateProfileData: `${host}/api/user/update/data`,
  updateProfilePicture: `${host}/api/user/update/picture`,
  // CHAT
  setMessagesSeen: `${host}/api/chat/seen`,
  // NOTIFICATION
  setNotificationSeen: `${host}/api/notification/seen`,
};

export { postLink, getLink, deleteLink, updateLink };
