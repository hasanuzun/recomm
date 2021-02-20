import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Paper } from "@material-ui/core";
import { useLocalize } from "../../shared/contexts/localize";

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

// The main responsibility of this component is to handle the user's login process.
// This is the starting point for the login process. Any component that needs to authenticate
// a user can simply perform a redirect to this component with a returnUrl query parameter and
// let the component perform the login and return back to the return url.
export const Home = (props: { action?: string }) => {
  const classes = useStyles();
  const { strings } = useLocalize();

  return (
    <div className={classes.root}>
      <Paper elevation={6} className={classes.paper}>
        <div>Hosgeldiniz, huhuhuh</div>
      </Paper>
    </div>
  );
};

export default Home;
