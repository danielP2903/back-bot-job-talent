export enum ENDPOINTS_BASE {
  AUTH = 'auth',
  USERS = 'users',
}
const baseuri = '/api/v1/';
export const ENDPOINTS_SEGMENTS = {
  AUTH: {
    login: '/login',
  },
};
export const ENDPOINTS_EXCLUDE = [
  {
    path: baseuri + ENDPOINTS_BASE.AUTH + ENDPOINTS_SEGMENTS.AUTH.login,
    type: 'post',
  },
  {
    path: baseuri + ENDPOINTS_BASE.USERS,
    type: 'post',
  },
];
