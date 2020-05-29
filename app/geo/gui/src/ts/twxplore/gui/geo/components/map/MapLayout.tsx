import * as React from "react";
import clsx from "clsx";
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles,
} from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
//import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import {Map} from "./Map";
import {connect} from "react-redux";
import {FilterPanel} from "../filterPanel/FilterPanel";
import {Icon, Grid} from "@material-ui/core";
import {SelectionPanel} from "../selectionPanel/SelectionPanel";
import {ToggleLayerPanel} from "../ToggleLayerPanel/ToggleLayerPanel";

const drawerWidth = 240;

const useDrawerStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    appBar: {
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: "none",
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerGridContainer: {
      flexGrow: 1,
      width: drawerWidth,
    },
    drawerHeader: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: "flex-end",
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
  })
);

const MapLayoutImpl: React.FunctionComponent = () => {
  const classes = useDrawerStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <Icon className="fas fa-sliders-h" style={{color: "white"}} />
          </IconButton>
          <Typography variant="h6" noWrap>
            Map
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>

        <Grid
          container
          spacing={2}
          className={classes.drawerGridContainer}
          direction="column"
          justify={"flex-start"}
        >
          <Grid
            container
            item
            direction="column"
            spacing={0}
            justify={"flex-start"}
            className={classes.drawerGridContainer}
          >
            <Grid item>
              <Typography align={"center"}>Filters</Typography>
            </Grid>

            <FilterPanel />
          </Grid>

          <Grid
            container
            item
            spacing={0}
            direction="column"
            className={classes.drawerGridContainer}
            justify={"flex-start"}
          >
            <Grid item>
              <Typography align={"center"}>Toggle Layer Visibility</Typography>
            </Grid>

            <Grid item container direction="column">
              <SelectionPanel />
            </Grid>
          </Grid>

          <Grid
            container
            item
            spacing={0}
            direction="column"
            className={classes.drawerGridContainer}
            justify={"flex-start"}
          >
            <Grid item>
              <Typography align={"center"}>Toggle Layer Type</Typography>
            </Grid>

            <Grid
              item
              container
              alignItems={"center"}
              spacing={2}
              wrap="wrap"
              direction="column"
            >
              <ToggleLayerPanel />
            </Grid>
          </Grid>
        </Grid>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <Map />
      </main>
    </div>
  );
};
export const MapLayout = connect()(MapLayoutImpl);
