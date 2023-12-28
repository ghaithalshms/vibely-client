const host = process.env.REACT_APP_API_URL;

const postLink = {
  // AUTH
  signIn: `${host}/api/auth/sign-in`,
  signUp: `${host}/api/auth/sign-up`,
  // USER
  checkUsername: `${host}/api/user/check-username`,
  follow: `${host}/api/user/follow`,
};
const getLink = {
  // USER
  getUserData: `${host}/api/user/data`,
  getUserFollowers: `${host}/api/user/followers`,
  getUserFollowing: `${host}/api/user/following`,
  // POST FLOW
  getUserPostFlow: `${host}/api/post-flow/user`,
};

export { postLink, getLink };
