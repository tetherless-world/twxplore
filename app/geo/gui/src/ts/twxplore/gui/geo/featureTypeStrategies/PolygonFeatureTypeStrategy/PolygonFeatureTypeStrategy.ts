import {FeatureTypeStrategy} from "../FeatureTypeStrategy";
import {FeatureType, FeatureQuery} from "../../api/graphqlGlobalTypes";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {Dispatch} from "redux";
import {MapFeatureTypeState} from "../../states/map/MapFeatureTypeState";
import {layerConfigChange, interactionConfigChange} from "kepler.gl/actions";

export abstract class PolygonFeatureTypeStrategy
  implements FeatureTypeStrategy {
  dispatchLayerConfigurationActions(kwds: {
    keplerLayerOfFeatureType: any;
    keplerFilterOfFeatureType: any;
    keplerFieldsOfFeatureType: any;
    keplerInteractionConfig: any;
    featureTypeStateOfFeatureType: MapFeatureTypeState;
    dispatch: Dispatch<any>;
  }): void {
    const {
      keplerLayerOfFeatureType,
      keplerInteractionConfig,
      featureTypeStateOfFeatureType,
      dispatch,
    } = kwds;
    switch (featureTypeStateOfFeatureType) {
      case MapFeatureTypeState.NEEDS_POPUP_CHANGE: {
        dispatch(interactionConfigChange(keplerInteractionConfig));
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
}
