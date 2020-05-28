import * as React from "react";
import {connect} from "react-redux";

import {Grid, Button, Typography} from "@material-ui/core";
import {FeatureType} from "../../api/graphqlGlobalTypes";

const ToggleLayerPanelImpl: React.FunctionComponent = () => {
  return (
    <Grid
      item
      container
      alignItems={"center"}
      spacing={2}
      wrap="wrap"
      direction="column"
      xs
    >
      {Object.values(FeatureType).map(featureType => {
        return (
          <Grid
            item
            container
            justify={"center"}
            alignItems={"center"}
            spacing={1}
            direction="row"
            wrap="nowrap"
            xs
          >
            <Grid item xs justify={"center"}>
              <Typography noWrap align={"center"}>
                {featureType}
              </Typography>
            </Grid>
            <Grid item xs justify={"center"}>
              <Button variant="contained" onClick={}>
                Toggle
              </Button>
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  );
};

export const ToggleLayerPanel = connect()(ToggleLayerPanelImpl);
