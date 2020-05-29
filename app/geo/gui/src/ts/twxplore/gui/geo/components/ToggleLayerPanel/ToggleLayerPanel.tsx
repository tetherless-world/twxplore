import * as React from "react";
import {connect, useDispatch, useSelector} from "react-redux";

import {Grid, Typography, FormControlLabel, Switch} from "@material-ui/core";
import {FeatureType} from "../../api/graphqlGlobalTypes";

import {toggleLayerChange} from "../../actions/map/ToggleLayerChangeAction";
import {getFeatureTypeStrategyByName} from "../../featureTypeStrategies/getFeatureTypeStrategyByName";
import {MapState} from "../../states/map/MapState";
import {RootState} from "../../states/root/RootState";
import {MapFeatureTypeState} from "../../states/map/MapFeatureTypeState";
import {togglePerspective} from "kepler.gl/actions";
import {KeplerLayerType} from "../../states/map/KeplerLayerType";

const ToggleLayerPanelImpl: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const state: MapState = useSelector(
    (rootState: RootState) => rootState.app.map
  );
  const handleLayerToggleClick = (featureType: FeatureType) => (event: any) => {
    //Toggle the map to 3d perspective
    dispatch(togglePerspective());
    dispatch(toggleLayerChange(featureType));
  };

  return (
    <React.Fragment>
      {Object.values(FeatureType).map(featureType => {
        const featureTypeStrategy = getFeatureTypeStrategyByName(featureType);
        if (!featureTypeStrategy.layerTypeToggleable) {
          return <React.Fragment />;
        }
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
              <FormControlLabel
                control={
                  <Switch
                    checked={
                      state.featuresByType[featureType]
                        .currentKeplerLayerType === KeplerLayerType.HEXAGON
                    }
                    onChange={handleLayerToggleClick(featureType)}
                    name="3d toggle"
                    disabled={
                      state.featuresByType[featureType].featureTypeState ===
                      MapFeatureTypeState.ABSENT_ON_MAP
                    }
                  />
                }
                label="Toggle 3D"
              />
            </Grid>
          </Grid>
        );
      })}
    </React.Fragment>
  );
};

export const ToggleLayerPanel = connect()(ToggleLayerPanelImpl);
