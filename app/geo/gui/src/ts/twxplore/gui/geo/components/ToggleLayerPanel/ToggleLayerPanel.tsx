import * as React from "react";
import {connect, useDispatch} from "react-redux";

import {Grid, Button, Typography} from "@material-ui/core";
import {FeatureType} from "../../api/graphqlGlobalTypes";

import {toggleLayerChange} from "../../actions/map/ToggleLayerChangeAction";
import {getFeatureTypeStrategyByName} from "../../featureTypeStrategies/getFeatureTypeStrategyByName";

const ToggleLayerPanelImpl: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const handleLayerToggleClick = (featureType: FeatureType) => (event: any) => {
    dispatch(toggleLayerChange(featureType));
  };

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
        const featureTypeStrategy = getFeatureTypeStrategyByName(featureType);
        if (featureTypeStrategy.layerTypeToggleable) {
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
                <Button
                  variant="contained"
                  onClick={handleLayerToggleClick(featureType)}
                >
                  Toggle
                </Button>
              </Grid>
            </Grid>
          );
        }
        return <React.Fragment />;
      })}
    </Grid>
  );
};

export const ToggleLayerPanel = connect()(ToggleLayerPanelImpl);
