import {PolygonFeatureTypeStrategy} from "./PolygonFeatureTypeStrategy";
import {FeatureType} from "../../api/graphqlGlobalTypes";
import {DispatchLayerConfigurationActionsParameters} from "../DispatchLayerConfigurationActionsParameters";
import {MapFeatureTypeState} from "../../states/map/MapFeatureTypeState";
import {layerConfigChange, layerVisConfigChange} from "kepler.gl/actions";

export class CountyFeatureTypeStrategy extends PolygonFeatureTypeStrategy {
  dispatchLayerConfigurationActions(
    kwds: DispatchLayerConfigurationActionsParameters
  ): void {
    super.dispatchLayerConfigurationActions(kwds);
    const {
      keplerLayerOfFeatureType,
      featureTypeStateOfFeatureType,
      dispatch,
    } = kwds;

    switch (featureTypeStateOfFeatureType) {
      case MapFeatureTypeState.NEEDS_LAYER_COLOR_CHANGE: {
        dispatch(
          layerVisConfigChange(keplerLayerOfFeatureType, {
            strokeColor: [248, 248, 249],
          })
        );
        dispatch(
          layerConfigChange(keplerLayerOfFeatureType, {
            color: [214, 213, 213],
          })
        );
        break;
      }

      default: {
        break;
      }
    }
  }
  readonly name = FeatureType.County;
  readonly childFeatureTypes = [
    FeatureType.Transmission,
    FeatureType.Transmitter,
  ];
  static readonly instance = new CountyFeatureTypeStrategy();
}
