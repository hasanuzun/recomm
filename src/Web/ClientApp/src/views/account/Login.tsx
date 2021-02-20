import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import { Gmail, Facebook, Microsoft } from "mdi-material-ui";
import { Paper, Theme } from "@material-ui/core";
import Spinner from "../../shared/components/Spinner";
import { useLocalize } from "../../shared/contexts/localize";
import { Redirect, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import authService, {
  AuthenticationResultStatus,
} from "./../../services/AuthorizeService";
import { LoginActions, QueryParameterNames } from "./../../shared/configs";
import { useAuth } from "../../shared/contexts/auth";

const useStyles = makeStyles((theme: Theme) => ({
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
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  socialBtn: {
    margin: theme.spacing(0, 0, 1),
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  or: {
    width: "100%",
    textAlign: "center",
    borderBottom: "1px solid #000",
    lineHeight: "0.1em",
    margin: "10px 0 20px",
  },
  orSpan: {
    background: theme.palette.background.paper,
    padding: "0 10px",
    fontSize: "12pt",
    fontStyle: "italic",
  },
  logo: {
    height: "110px",
    marginBottom: "-30px",
    marginTop: "-15px",
  },
}));

type FormState = {
  email: string;
  password: string;
};

// The main responsibility of this component is to handle the user's login process.
// This is the starting point for the login process. Any component that needs to authenticate
// a user can simply perform a redirect to this component with a returnUrl query parameter and
// let the component perform the login and return back to the return url.
export const Login = (props: { action?: string }) => {
  const classes = useStyles();
  const { strings } = useLocalize();
  const { isAuthenticated } = useAuth();

  const history = useHistory();

  const { register, handleSubmit, errors } = useForm<FormState>();

  const [compState, setCompState] = useState<{
    isFetching: boolean;
    message?: string | null;
  }>({ isFetching: false, message: "" });

  const { action } = props;
  const { isFetching, message } = compState;

  const getReturnUrl = (state?: any): string => {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get(QueryParameterNames.ReturnUrl);
    if (fromQuery && !fromQuery.startsWith(`${window.location.origin}/`)) {
      // This is an extra check to prevent open redirects.
      // throw new Error(
      //  "Invalid return url. The return url needs to have the same origin as the current page."
      //);
    }
    return (
      (state && state.returnUrl) || fromQuery || "/" // `${window.location.origin}/`
    );
  };

  useEffect(() => {
    const processLoginCallback = async () => {
      const url = window.location.href;
      const result = await authService.completeSignIn(url);
      switch (result.status) {
        case AuthenticationResultStatus.Redirect:
          // There should not be any redirects as the only time completeSignIn finishes
          // is when we are doing a redirect sign in flow.
          throw new Error("Should not redirect.");
        case AuthenticationResultStatus.Success:
          history.replace(getReturnUrl(result.state));
          break;
        case AuthenticationResultStatus.Fail:
          setCompState((prevState) => ({
            ...prevState,
            message: result.message,
          }));
          break;
        default:
          throw new Error(
            `Invalid authentication result status '${result.status}'.`
          );
      }
    };

    switch (action) {
      case LoginActions.Login:
        //login(getReturnUrl());
        break;
      case LoginActions.LoginCallback:
        processLoginCallback();
        break;
      case LoginActions.LoginFailed:
        const params = new URLSearchParams(window.location.search);
        const error = params.get(QueryParameterNames.Message);
        setCompState((prevState) => ({ ...prevState, message: error }));
        break;
      default:
        throw new Error(`Invalid action '${action}'`);
    }
  }, [action, history]);

  const handleLogin = async (data: FormState) => {
    if (!errors.email && !errors.password) {
      setCompState((prevState) => ({ ...prevState, isFetching: true }));
      await authService
        .signinByPassword(data.email, data.password, strings)
        .then((r) => {
          setCompState((prevState) => ({
            ...prevState,
            isFetching: false,
            message: r.errorMessage ?? "",
          }));
        });
    }
  };

  if (isAuthenticated) {
    return <Redirect to={getReturnUrl()} />;
  }

  if (action !== LoginActions.Login) {
    return (
      <div className={classes.root}>
        <Spinner visible={isFetching}>
          <Paper elevation={6} className={classes.paper}>
            {message !== "" && <Typography color="error">{message}</Typography>} 
            {!message && action === LoginActions.LoginCallback && (
              <div>{strings.account.processingLogin}</div>
            )}
          </Paper>
        </Spinner>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Spinner visible={isFetching}>
        <Paper elevation={6} className={classes.paper}>
          <form className="form" onSubmit={handleSubmit(handleLogin)}>
            <img
              alt={strings.app.title}
              className={classes.logo}
              src="/android-chrome-192x192.png"
            />
            {message !== "" && <Typography color="error">{message}</Typography>}
            <TextField
              variant="outlined"
              margin="dense"
              fullWidth
              label={strings.account.emailorUsername}
              name="email"
              autoComplete="email"
              autoFocus={!errors.email}
              inputRef={register({ required: true })}
            />
            <TextField
              variant="outlined"
              margin="dense"
              fullWidth
              autoFocus={errors.email && !errors.password}
              name="password"
              label={strings.account.password}
              type="password"
              autoComplete="current-password"
              inputRef={register({ required: true })}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {strings.account.signin}
            </Button>
          </form>
          <Typography className={classes.or} variant="h2">
            <span className={classes.orSpan}>{strings.shared.or}</span>
          </Typography>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            className={classes.socialBtn}
            onClick={() => authService.signinByExternProvider("Google")}
          >
            <Gmail className={classes.icon} />
            {strings.account.signInViaGoogle}
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            className={classes.socialBtn}
            onClick={() => authService.signinByExternProvider("Facebook")}
          >
            <Facebook className={classes.icon} />
            {strings.account.signInViaFacebook}
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            className={classes.socialBtn}
            onClick={() => authService.signinByExternProvider("AAD")}
          >
            <Microsoft className={classes.icon} />
            {strings.account.signInViaMicrosoft}
          </Button>
        </Paper>
      </Spinner>
    </div>
  );
};

export default Login;
