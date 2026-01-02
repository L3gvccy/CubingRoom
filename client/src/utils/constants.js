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
