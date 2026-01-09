export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "/api/auth";
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const REGISTER_ROUTE = `${AUTH_ROUTES}/register`;
export const GET_ME_ROUTE = `${AUTH_ROUTES}/me`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;

export const WCA_ROUTES = "/api/wca";
export const WCA_AUTH_ROUTE = `${WCA_ROUTES}/auth`;

export const PROFILE_ROUTES = "/api/profile";
export const GET_USER_ROUTE = `${PROFILE_ROUTES}/users`;
export const UPDATE_NAME_ROUTE = `${PROFILE_ROUTES}/update-name`;
export const UPDATE_TIMER_TYPE = `${PROFILE_ROUTES}/update-timer-type`;

export const CONTEST_ROUTES = "/api/contest";
export const GET_ALL_CONTESTS_ROUTE = `${CONTEST_ROUTES}/get-all-contests`;
export const GET_CONTEST_ROUTE = (contestId) => {
  return `${CONTEST_ROUTES}/get-contest/${contestId}`;
};

export const ROOM_ROUTES = "/api/room";
export const GET_ALL_ROOMS = `${ROOM_ROUTES}/all`;
export const GET_ROOM_BY_ID = (roomId) => {
  return `${ROOM_ROUTES}/${roomId}`;
};
export const CREATE_ROOM = `${ROOM_ROUTES}/create`;
export const JOIN_ROOM = `${ROOM_ROUTES}/join`;

export const SCRAMBLE_ROUTES = "/api/scramble";
export const GENERATE_SCRAMBLE = (event) => {
  return `${SCRAMBLE_ROUTES}/generate-scramble/${event}`;
};
