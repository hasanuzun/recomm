import React from "react";
import { Route, Redirect } from "react-router-dom";
import { ApplicationPaths, QueryParameterNames } from "./../shared/configs";
import { useAuth } from "../shared/contexts/auth";

export const AuthorizeRoute = (props: any) => {
  const { isReady, isAuthenticated } = useAuth();

  const { component: Component, ...rest } = props;

  var link = document.createElement("a");
  link.href = props.path;
  const returnUrl = `${link.pathname}${link.search}${link.hash}`;
 
  const redirectUrl = `${ApplicationPaths.Login}?${
    QueryParameterNames.ReturnUrl
  }=${encodeURIComponent(returnUrl)}`;

  return (
    <React.Fragment>
      {!isReady && <div></div>}
      {isReady && (
        <Route
          {...rest}
          render={(props) => {
            if (isAuthenticated) {
              return <Component {...props} />;
            } else {
              return <Redirect to={redirectUrl} />;
            }
          }}
        />
      )}
    </React.Fragment>
  );
};

export default AuthorizeRoute;
