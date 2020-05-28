import {PointFeatureTypeStrategy} from "./PointFeatureTypeStrategy";
import {FeatureType} from "../../api/graphqlGlobalTypes";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {DispatchLayerConfigurationActionsParameters} from "../DispatchLayerConfigurationActionsParameters";
import {layerConfigChange, interactionConfigChange} from "kepler.gl/actions";
import {MapFeatureTypeState} from "../../states/map/MapFeatureTypeState";

export class PolicyFeatureTypeStrategy extends PointFeatureTypeStrategy {
  readonly name = FeatureType.Policy;
  dispatchLayerConfigurationActions(
    kwds: DispatchLayerConfigurationActionsParameters
  ): void {
    const {
      keplerLayerOfFeatureType,
      keplerInteractionConfigCopy,
      featureTypeStateOfFeatureType,
      dispatch,
    } = kwds;
    switch (featureTypeStateOfFeatureType) {
      case MapFeatureTypeState.NEEDS_POPUP_CHANGE: {
        dispatch(interactionConfigChange(keplerInteractionConfigCopy));
        dispatch(
          layerConfigChange(keplerLayerOfFeatureType, {isConfigActive: true})
        );
        const newLayerConfig = {
          label: this.name,
        };
        dispatch(layerConfigChange(keplerLayerOfFeatureType, newLayerConfig));
        break;
      }
      case MapFeatureTypeState.NEEDS_LAYER_COLOR_CHANGE: {
        dispatch(
          layerConfigChange(keplerLayerOfFeatureType, {
            color: [0, 128, 0],
          })
        );
        break;
      }

      default: {
        break;
      }
    }
  }
  static readonly instance = new PolicyFeatureTypeStrategy();
  readonly fieldsToShowOnPopup = [
    FeatureAttributeName.label,
    FeatureAttributeName.type,
  ];
  readonly heightAttributeFor3DMap = null;
  readonly layerTypeToggleable = false;
}
