import * as React from "react";
import {layerConfigChange} from "kepler.gl/actions";
import {makeStyles, createStyles} from "@material-ui/core/styles";
import {
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  Theme,
} from "@material-ui/core";
import {FeatureType} from "../../api/graphqlGlobalTypes";
import {useSelector, useDispatch, connect} from "react-redux";
import {MapState} from "../../states/map/MapState";
import {RootState} from "../../states/root/RootState";
import {changeTypeVisibility} from "../../actions/map/ChangeTypeVisibilityAction";
import {MapFeatureTypeState} from "../../states/map/MapFeatureTypeState";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    formControl: {
      margin: theme.spacing(3),
    },
  })
);

const SelectionPanelImpl: React.FunctionComponent = () => {
  const classes = useStyles();
  const state: MapState = useSelector(
    (rootState: RootState) => rootState.app.map
  );

  const keplerState: any = useSelector(
    (rootState: RootState) => rootState.keplerGl
  );
  const dispatch = useDispatch();

  const handleChange = (featureType: FeatureType) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const keplerLayers = keplerState.map.visState.layers;
    const layerIndex = keplerLayers.findIndex(
      (layer: {config: {dataId: string}}) => layer.config.dataId === featureType
    );
    const newLayerConfig = {
      isVisible: !state.featuresByType[featureType].visible,
    };
    dispatch(layerConfigChange(keplerLayers[layerIndex], newLayerConfig));
    dispatch(changeTypeVisibility(featureType));
  };

  //const featureTypes: {[index: string]: String} = {}

  //const error = [gilad, jason, antoine].filter(v => v).length !== 2;
  return (
    <div className={classes.root}>
      <FormControl className={classes.formControl}>
        <FormLabel component="legend">Choose types to display</FormLabel>
        <FormGroup>
          {Object.values(FeatureType).map(featureType => {
            if (featureType != FeatureType.Root) {
              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={state.featuresByType[featureType].visible!}
                      onChange={handleChange(featureType)}
                      value={featureType}
                      disabled={
                        state.featuresByType[featureType].featureTypeState ===
                        MapFeatureTypeState.ABSENT_ON_MAP
                      }
                    />
                  }
                  label={featureType}
                />
              );
            } else {
              return <React.Fragment />;
            }
          })}
        </FormGroup>
        <FormHelperText>
          Types chosen here will be visible on the map and invisible otherwise.
        </FormHelperText>
      </FormControl>
    </div>
  );
};
export const SelectionPanel = connect()(SelectionPanelImpl);
