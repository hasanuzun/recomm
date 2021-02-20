import React, { useState } from "react";

import {
  IconButton,
  TextField,
  TextFieldProps,
  Tooltip,
} from "@material-ui/core";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import VisibilityIcon from "@material-ui/icons/Visibility";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useLocalize } from "../contexts/localize";
import clsx from "clsx";
import nameof from "../nameof";

interface PasswordFieldContainerProps {
  showCopyButton: boolean;
  hideAfterVisible?: boolean;
  hideAfterTime?: number;
  showDetailsButton?: boolean;
  onShowDetails?: (show: boolean) => void;
}

type PasswordFieldProps = TextFieldProps & PasswordFieldContainerProps;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    passTxtContainer: {
      display: "flex",
      flexWrap: "nowrap",
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      alignContent: "flex-start",
      width: "100%",
      "& .MuiIconButton-root": {
        paddingLeft: 0,
        paddingRight: 0,
        marginLeft: theme.spacing(1),
      },
      "& .MuiSvgIcon-root": {
        width: "0.8em",
        height: "0.8em",
      },
    },
    passTxt: {
      flex: "1 1 auto",
      "& .MuiFormControl-root": {
        width: "100%",
      },
    },
    actionBtn: {
      flex: "0 0 auto",
    },
    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: "rotate(180deg)",
    },
  })
);

const PasswordField = (
  props: PasswordFieldProps = {
    showCopyButton: true,
    hideAfterVisible: true,
    hideAfterTime: 3000,
    showDetailsButton: false,
  }
) => {
  const classes = useStyles();
  const { strings } = useLocalize();

  const txtRef = React.useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [expanded, setExpanded] = React.useState(false);

  const handleVisibleClick = () => {
    if ((props.hideAfterVisible ?? true) && !isVisible) {
      setTimeout(() => {
        setIsVisible(false);
      }, props.hideAfterTime ?? 3000);
    }

    setIsVisible(!isVisible);
  };

  const handleExpandClick = () => {
    let newValue = !expanded;
    setExpanded(newValue);
    if (props.onShowDetails) {
      props.onShowDetails(newValue);
    }
  };

  const handleCopyClick = () => {
    var p = props as any;
    if (p.value) {
      navigator.clipboard.writeText(p.value).then(
        function () {
          /* clipboard write success */
        },
        function () {
          /* clipboard write failed */
        }
      );
    }
  };

  var p = props as any;

  const editorProps = {} as any;

  Object.keys(props)
    .filter(
      (x) =>
        x !== nameof<PasswordFieldContainerProps>((p) => p.hideAfterTime) &&
        x !== nameof<PasswordFieldContainerProps>((p) => p.hideAfterTime) &&
        x !== nameof<PasswordFieldContainerProps>((p) => p.hideAfterVisible) &&
        x !== nameof<PasswordFieldContainerProps>((p) => p.onShowDetails) &&
        x !== nameof<PasswordFieldContainerProps>((p) => p.showCopyButton) &&
        x !== nameof<PasswordFieldContainerProps>((p) => p.showDetailsButton)
    )
    .forEach((x) => (editorProps[x] = p[x]));

  const mergedProps = {
    ...editorProps,
    ref: txtRef,
    disabled: props.disabled ?? true,
    type: isVisible ? "text" : "password",
  };

  return (
    <React.Fragment>
      <div className={classes.passTxtContainer}>
        <div className={classes.passTxt}>
          <TextField {...mergedProps} />
        </div>
        <div className={classes.actionBtn}>
          <Tooltip
            title={isVisible ? strings.shared.hide : strings.shared.show}
          >
            <IconButton
              aria-label={isVisible ? strings.shared.hide : strings.shared.hide}
              onClick={handleVisibleClick}
            >
              {isVisible && <VisibilityOffIcon />}
              {!isVisible && <VisibilityIcon />}
            </IconButton>
          </Tooltip>
        </div>

        {props.showCopyButton && (
          <div className={classes.actionBtn}>
            <Tooltip title={strings.shared.copy}>
              <IconButton
                aria-label={strings.shared.copy}
                onClick={handleCopyClick}
              >
                <FileCopyIcon />
              </IconButton>
            </Tooltip>
          </div>
        )}

        {props.showDetailsButton && (
          <div className={classes.actionBtn}>
            <Tooltip title={strings.shared.copy}>
              <IconButton
                className={clsx(classes.expand, {
                  [classes.expandOpen]: expanded,
                })}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default PasswordField;
