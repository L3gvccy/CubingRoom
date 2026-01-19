export const HOST = import.meta.env.VITE_SERVER_URL;

// Authentication routes
export const AUTH_ROUTES = "/api/auth";
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const REGISTER_ROUTE = `${AUTH_ROUTES}/register`;
export const GET_ME_ROUTE = `${AUTH_ROUTES}/me`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;

// WCA ID routes
export const WCA_ROUTES = "/api/wca";
export const WCA_AUTH_ROUTE = `${WCA_ROUTES}/auth`;

// Profile routes
export const PROFILE_ROUTES = "/api/profile";
export const GET_USER_ROUTE = `${PROFILE_ROUTES}/users`;
export const UPDATE_NAME_ROUTE = `${PROFILE_ROUTES}/update-name`;
export const UPDATE_TIMER_TYPE = `${PROFILE_ROUTES}/update-timer-type`;

// Room routes
export const ROOM_ROUTES = "/api/room";
export const GET_ALL_ROOMS = `${ROOM_ROUTES}/all`;
export const GET_ROOM_BY_ID = (roomId) => {
  return `${ROOM_ROUTES}/${roomId}`;
};
export const CREATE_ROOM = `${ROOM_ROUTES}/create`;
export const JOIN_ROOM = `${ROOM_ROUTES}/join`;

// Contest routes
export const CONTESTS_ROUTES = "/api/contests";
export const GET_ALL_CONTESTS = CONTESTS_ROUTES;
export const GET_CONTEST_EVENT = (contestEventId) => {
  return `${CONTESTS_ROUTES}/get/${contestEventId}`;
};
export const GET_CONTEST_RESULT = (contestEventId) => {
  return `${CONTESTS_ROUTES}/get-result/${contestEventId}`;
};
export const ADD_CONTEST_TIME = (contestEventId) => {
  return `${CONTESTS_ROUTES}/add-time/${contestEventId}`;
};
export const SUBMIT_CONTEST_RESULT = (contestEventId) => {
  return `${CONTESTS_ROUTES}/submit-result/${contestEventId}`;
};

// Scramble routes
export const SCRAMBLE_ROUTES = "/api/scramble";
export const GENERATE_SCRAMBLE = (event) => {
  return `${SCRAMBLE_ROUTES}/generate-scramble/${event}`;
};
