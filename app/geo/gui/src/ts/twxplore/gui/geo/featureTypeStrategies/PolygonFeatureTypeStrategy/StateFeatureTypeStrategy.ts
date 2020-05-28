import {PolygonFeatureTypeStrategy} from "./PolygonFeatureTypeStrategy";
import {FeatureType} from "../../api/graphqlGlobalTypes";
import {DispatchLayerConfigurationActionsParameters} from "../DispatchLayerConfigurationActionsParameters";
import {MapFeatureTypeState} from "../../states/map/MapFeatureTypeState";
import {layerConfigChange} from "kepler.gl/actions";
export class StateFeatureTypeStrategy extends PolygonFeatureTypeStrategy {
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
          layerConfigChange(keplerLayerOfFeatureType, {
            strokeColor: [248, 248, 249],
          })
        );
        dispatch(
          layerConfigChange(keplerLayerOfFeatureType, {
            color: [113, 113, 113],
          })
        );
        break;
      }

      default: {
        break;
      }
    }
  }
  readonly name = FeatureType.State;
  readonly childFeatureTypes = [
    FeatureType.County,
    FeatureType.MetropolitanDivision,
    FeatureType.MilitaryInstallation,
  ];
  static readonly instance = new StateFeatureTypeStrategy();
}
