const host = process.env.REACT_APP_API_URL;

const postLink = {
  signIn: `${host}/api/auth/sign-in`,
  signUp: `${host}/api/auth/sign-up`,
  checkUsername: `${host}/api/user/check-username`,
  follow: `${host}/api/user/follow`,
};
const getLink = {
  getUserData: `${host}/api/user/data`,
  getUserPostFlow: `${host}/api/user/post-flow`,
};

export { postLink, getLink };
