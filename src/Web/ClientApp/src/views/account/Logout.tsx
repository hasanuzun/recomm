import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Paper } from "@material-ui/core";
import Spinner from "../../shared/components/Spinner";
//import { useLocalize } from "../../shared/contexts/localize";
import { useHistory } from "react-router-dom";
import authService, {
  AuthenticationResultStatus,
} from "./../../services/AuthorizeService";
import {
  ApplicationPaths,
  LogoutActions,
  QueryParameterNames,
} from "./../../shared/configs";
import strings from "../../i18n/strings";

interface LogoutState {
  message?: string;
  isReady: boolean;
  authenticated: boolean;
}
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "300px",
    marginTop: theme.spacing(4),
    marginLeft: "auto",
    marginRight: "auto",
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& .MuiTextField-root": {
      width: "100%", // Fix IE 11 issue.
    },
    "& .MuiButton-root span": {
      textTransform: "initial!important",
    },
  },
}));

// The main responsibility of this component is to handle the user's logout process.
// This is the starting point for the logout process, which is usually initiated when a
// user clicks on the logout button on the LoginMenu component.
export const Logout = (props: { action?: string }) => {
  const classes = useStyles();
  //const { strings } = useLocalize();

  const history = useHistory();

  const [compState, setCompState] = useState<LogoutState>({
    message: undefined,
    isReady: false,
    authenticated: false,
  });

  const { action } = props;
  const { isReady, message, authenticated } = compState;

  const populateAuthenticationState = async () => {
    const authenticated = await authService.isAuthenticated();

    setCompState((prevState) => ({
      ...prevState,
      isReady: true,
      authenticated,
    }));
  };

  const getReturnUrl = (state?: any) => {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get(QueryParameterNames.ReturnUrl);
    if (fromQuery && !fromQuery.startsWith(`${window.location.origin}/`)) {
      // This is an extra check to prevent open redirects.
      throw new Error(
        "Invalid return url. The return url needs to have the same origin as the current page."
      );
    }
    return (
      (state && state.returnUrl) ||
      fromQuery ||
      `${window.location.origin}${ApplicationPaths.Login}`
    );
  };

  const navigateToReturnUrl = (returnUrl: string) => {
    return window.location.replace(returnUrl);
  };

  useEffect(() => {
    const logout = async (returnUrl: string) => {
      const state = { returnUrl };
      const isauthenticated = await authService.isAuthenticated();
      if (isauthenticated) {
        const result = await authService.signOut(state);
        switch (result.status) {
          case AuthenticationResultStatus.Redirect:
            break;
          case AuthenticationResultStatus.Success:
            navigateToReturnUrl(returnUrl);
            break;
          case AuthenticationResultStatus.Fail:
            setCompState((prevState) => ({
              ...prevState,
              message: result.message,
            }));
            break;
          default:
            throw new Error("Invalid authentication result status.");
        }
      } else {
        setCompState((prevState) => ({
          ...prevState,
          message: "You successfully logged out!",
          authenticated: false,
        }));
      }
    };

    const processLogoutCallback = async () => {
      const url = window.location.href;
      const result = await authService.completeSignOut(url);
      switch (result.status) {
        case AuthenticationResultStatus.Redirect:
          // There should not be any redirects as the only time completeAuthentication finishes
          // is when we are doing a redirect sign in flow.
          throw new Error("Should not redirect.");
        case AuthenticationResultStatus.Success:
          navigateToReturnUrl(getReturnUrl(result.state));
          break;
        case AuthenticationResultStatus.Fail:
          setCompState((prevState) => ({
            ...prevState,
            message: result.message,
          }));
          break;
        default:
          throw new Error("Invalid authentication result status.");
      }
    };

    switch (action) {
      case LogoutActions.Logout:
        if (!!window.history?.state.state.local) {
          logout(getReturnUrl());
        } else {
          // This prevents regular links to <app>/authentication/logout from triggering a logout

          setCompState((prevState) => ({
            ...prevState,
            isReady: true,
            message: "The logout was not initiated from within the page.",
          }));
        }
        break;
      case LogoutActions.LogoutCallback:
        processLogoutCallback();
        break;
      case LogoutActions.LoggedOut:
        setCompState((prevState) => ({
          ...prevState,
          isReady: true,
          message: "You successfully logged out!",
        }));

        setTimeout(() => {
          history.replace(ApplicationPaths.Login);
        }, 1000);
        break;
      default:
        throw new Error(`Invalid action '${action}'`);
    }

    populateAuthenticationState();
  }, [action, history]);

  return (
    <div className={classes.root}>
      <Spinner visible={!isReady || authenticated}>
        <Paper elevation={6} className={classes.paper}>
          {!!message && <div>{message}</div>}
          {!message && action === LogoutActions.Logout && (
              <div>{strings.account.processingLogout}</div>
          )}
          {!message && action === LogoutActions.LogoutCallback && (
              <div>{strings.account.processingLogout}</div>
          )}
          {!message && action === LogoutActions.LoggedOut && (
            <div>{message}</div>
          )}
        </Paper>
      </Spinner>
    </div>
  );
};
export default Logout;
