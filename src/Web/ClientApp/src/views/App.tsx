import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import clsx from "clsx";
import AppLayout from "./layout/AppLayout";
import Routers from "../routes/Routers";
import Footer from "./layout/Footer";
import { useAuth } from "../shared/contexts/auth"; 

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      height: "100%",
    },
    content: {
      flexGrow: 1,
      width: "100%",
      height: "100%",
    },
    contentOffset: {
      padding: theme.spacing(1),
      marginBottom: theme.mixins.toolbar.height,
      marginTop: theme.mixins.toolbar.height,
    },
    contentPaper: {
      width: "100%",
      height: "auto",
      minHeight: "calc(100% - 40px)",
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
  })
);

export default function App() {
  const classes = useStyles();
  const { isAuthenticated } = useAuth(); 

  return (
    <React.Fragment>
      <CssBaseline />
      <div className={classes.root}>
        {isAuthenticated && <AppLayout />}
        <main
          className={clsx(classes.content, {
            [classes.contentOffset]: isAuthenticated,
          })}
        >
          <Routers />
        </main>
        <Footer />
      </div>
    </React.Fragment>
  );
}
