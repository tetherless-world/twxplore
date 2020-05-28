import {FeatureTypeStrategy} from "../FeatureTypeStrategy";
import {FeatureType, FeatureQuery} from "../../api/graphqlGlobalTypes";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {MapFeatureTypeState} from "../../states/map/MapFeatureTypeState";
import {layerConfigChange, interactionConfigChange} from "kepler.gl/actions";
import {DispatchLayerConfigurationActionsParameters} from "../DispatchLayerConfigurationActionsParameters";

export abstract class PolygonFeatureTypeStrategy
  implements FeatureTypeStrategy {
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

      default: {
        break;
      }
    }
  }
  getClickedQuery(clickedFeatureUri: string): FeatureQuery {
    return {
      withinFeatureUri: clickedFeatureUri,
      types: this.childFeatureTypes,
    };
  }
  readonly fieldsToShowOnPopup = [
    FeatureAttributeName.label,
    FeatureAttributeName.type,
  ];
  abstract readonly name: FeatureType;
  abstract readonly childFeatureTypes: FeatureType[];
  readonly expandable = true;
  readonly heightAttributeFor3DMap = null;
  readonly layerTypeToggleable = false;
}
