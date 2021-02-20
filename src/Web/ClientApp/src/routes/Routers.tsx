import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import AuthorizeRoute from "./AuthorizeRoute";
import Login from "../views/account/Login";
import Logout from "../views/account/Logout";
import {
  ApplicationPaths,
  LoginActions,
  LogoutActions,
} from "../shared/configs";
import Home from "../views/home/Home";

export default function Routers() {
  return (
    <Switch>
      <Route
        path={ApplicationPaths.Login}
        render={() => loginAction(LoginActions.Login)}
      />
      <Route
        path={ApplicationPaths.LoginFailed}
        render={() => loginAction(LoginActions.LoginFailed)}
      />
      <Route
        path={ApplicationPaths.LoginCallback}
        render={() => loginAction(LoginActions.LoginCallback)}
      />
      <Route
        path={ApplicationPaths.LogOut}
        render={() => logoutAction(LogoutActions.Logout)}
      />
      <Route
        path={ApplicationPaths.LogOutCallback}
        render={() => logoutAction(LogoutActions.LogoutCallback)}
      />
      <Route
        path={ApplicationPaths.LoggedOut}
        render={() => logoutAction(LogoutActions.LoggedOut)}
      />

      <AuthorizeRoute path="/home" component={Home} />

      <Redirect exact path="/" to="/home" />
    </Switch>
  );
}

const loginAction = (name: string) => {
  return <Login action={name}></Login>;
};

const logoutAction = (name: string) => {
  return <Logout action={name}></Logout>;
};
