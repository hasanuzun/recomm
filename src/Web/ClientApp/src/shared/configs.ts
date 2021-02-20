import { UserManagerSettings, WebStorageStateStore } from "oidc-client";

export interface AppConfig {
  apiUrl: string;
  appUrl: string;
}

const appEnv: AppEnv =
  process.env.NODE_ENV === "development" ? process.env : window._env_;

//console.log("env app", appEnv, window._env_, process.env);

export const appConfig: AppConfig = {
  apiUrl: appEnv.REACT_APP_API_URL,
  appUrl: appEnv.REACT_APP_APP_URL,
};

export const QueryParameterNames = {
  ReturnUrl: "returnUrl",
  Message: "message",
};

export const LogoutActions = {
  LogoutCallback: "logout-callback",
  Logout: "logout",
  LoggedOut: "logged-out",
};

export const LoginActions = {
  Login: "login",
  LoginCallback: "login-callback",
  LoginFailed: "login-failed",
};

const prefix = "/auth";

export const ApplicationPaths = {
  DefaultLoginRedirectPath: "/",
  ApiAuthorizationPrefix: prefix,
  Login: `${prefix}/${LoginActions.Login}`,
  LoginFailed: `${prefix}/${LoginActions.LoginFailed}`,
  LoginCallback: `${prefix}/${LoginActions.LoginCallback}`,
  LogOut: `${prefix}/${LogoutActions.Logout}`,
  LoggedOut: `${prefix}/${LogoutActions.LoggedOut}`,
  LogOutCallback: `${prefix}/${LogoutActions.LogoutCallback}`,
};

export const authSettings: UserManagerSettings = {
  authority: appEnv.REACT_APP_AUTH_URL,
  client_id: appEnv.REACT_APP_AUTH_CLIENT_ID,
  // redirect_uri: `${appEnv.REACT_APP_APP_URL}/auth/callback`,
  redirect_uri: `${window.location.origin}${ApplicationPaths.LoginCallback}`,
  silent_redirect_uri: `${window.location.origin}${ApplicationPaths.LoginCallback}`,
  //silent_redirect_uri: `${appEnv.REACT_APP_APP_URL}/auth/callback`,
  //post_logout_redirect_uri: `${appEnv.REACT_APP_APP_URL}/auth/signout`,
  post_logout_redirect_uri: `${window.location.origin}${ApplicationPaths.LogOutCallback}`,
  response_type: "code",
  loadUserInfo: false,
  includeIdTokenInSilentRenew: true,
  automaticSilentRenew: true,
  clockSkew: 250,
  monitorSession: true,
  scope: `openid profile email ${appEnv.REACT_APP_APIScope}`.trimEnd(),
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
};
