import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";

import { CircularProgress, LinearProgress } from "@material-ui/core";

interface SpinnerProps {
  count?: number;
  type?: "circular" | "linear";
  children?: React.ReactElement | React.ReactElement[];
  visible?: boolean;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    contentWrapper: {
      width: "100%",
      height: "100%",
      margin: 0,
      padding: 0,
      position: "relative",
      overflow: "hidden",
    },

    overlayinSpinner: {
      position: "absolute",
      zIndex: 1000,
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: "auto",
      marginBottom: "auto",
      width: "100%",
      height: "100%",
      opacity: "0.8",
      backgroundColor: "lightgray",
    },

    pureSpinner: {
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: "auto",
      marginBottom: "auto",
      width: "100%",
      height: "100%",
    },
  })
);

const Spinner = (props: SpinnerProps) => {
  const classes = useStyles();

  if (props.visible === false) {
    return <React.Fragment>{props.children}</React.Fragment>;
  }

  const items = [];
  const c = props.count ?? 3;
  for (let index = 0; index < c; index++) {
    let color: "primary" | "secondary" =
      index % 2 === 0 ? "primary" : "secondary";

    if (props.type === "circular") {
      items.push(<CircularProgress color={color} key={"k" + index} />);
    } else {
      items.push(<LinearProgress color={color} key={"k" + index} />);
    }

    if (index < c - 1) {
      items.push(<br key={"br" + index} />);
    }
  }

  if (props.children) {
    return (
      <React.Fragment>
        <div className={classes.contentWrapper}>
          <div className={classes.overlayinSpinner}>{items}</div>
          {props.children}
        </div>
      </React.Fragment>
    );
  } else {
    return <div className={classes.pureSpinner}>{items}</div>;
  }
};

export default Spinner;
