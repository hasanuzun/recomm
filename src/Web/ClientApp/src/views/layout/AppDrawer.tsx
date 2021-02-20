import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppMenu from './AppMenu'

type AppDrawerProps = {
  open: boolean
}
export default function AppDrawer(props: AppDrawerProps) {

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      drawer: {
        width: theme.appDrawer.width ,
        flexShrink: 0,
        whiteSpace: 'nowrap',
      },
      drawerPaper: {
        top: theme.mixins.toolbar.height,
      },
      drawerOpen: {
        width: theme.appDrawer.width ,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
      drawerClose: {
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(5) + 1,
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(6) + 1,
        },
      },
    }),
  );

  const classes = useStyles();

  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: props.open,
        [classes.drawerClose]: !props.open,
      })}
      classes={{
        paper: clsx(
          classes.drawerPaper, {
          [classes.drawerOpen]: props.open,
          [classes.drawerClose]: !props.open,
        }),
      }}
    >     
      <AppMenu></AppMenu>
    </Drawer>
  );
}
