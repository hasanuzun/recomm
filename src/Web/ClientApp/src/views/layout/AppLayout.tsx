import React from "react";
import clsx from "clsx";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { Icon } from "@material-ui/core";
import Link from "@material-ui/core/Link";
import UserProfile from "./UserProfile";
import { useLocalize } from "../../shared/contexts/localize"; 

export default function AppLayout() {
  const { strings } = useLocalize(); 

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      grow: {
        flexGrow: 1,
      },
      logo: {
        height: "100%",
      },
      appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      },
      menuButton: {
        marginRight: "8px",
        marginLeft: "3px",
      },
      button: {
        margin: theme.spacing(1),
      },
      hide: {
        display: "none",
      },
      toolbar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
      },

      offset: theme.mixins.toolbar,
    })
  );
  const classes = useStyles();
 
  return (
    <React.Fragment>
      <div className={classes.grow}>
        <AppBar position="fixed" className={clsx(classes.appBar)}>
          <Toolbar disableGutters>
            <Link href="/" >
              <IconButton
                color="inherit"
                aria-label="app logo"
                edge="start"
                className={classes.menuButton}
              >
                <Icon>
                  <img
                    alt={strings.app.title}
                    className={classes.logo}
                    src="/android-chrome-192x192.png"
                  />
                </Icon>
              </IconButton>
            </Link>
            <Typography variant="h6" noWrap>
              {strings.app.title}
            </Typography>
            <div className={classes.grow} />
            <UserProfile />
          </Toolbar>
        </AppBar> 
      </div>
    </React.Fragment>
  );
}
