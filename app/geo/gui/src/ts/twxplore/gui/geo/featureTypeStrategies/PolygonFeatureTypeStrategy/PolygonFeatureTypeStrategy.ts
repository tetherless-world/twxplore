import {FeatureTypeStrategy} from "../FeatureTypeStrategy";
import {FeatureType, FeatureQuery} from "../../api/graphqlGlobalTypes";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {Dispatch} from "redux";
import {FeaturesByType} from "../../states/map/FeaturesByType";
import {MapFeatureTypeState} from "../../states/map/MapFeatureTypeState";
import {
  layerConfigChange,
  //removeLayer,
} from "kepler.gl/actions";

export abstract class PolygonFeatureTypeStrategy
  implements FeatureTypeStrategy {
  dispatchLayerConfigurationActions(
    keplerLayerOfFeatureType: any,
    keplerFiltersOfFeatureType: any,
    keplerFieldsOfFeatureType: any,
    dispatch: Dispatch<any>,
    featuresByType: {
      [featureType: string]: FeaturesByType;
    }
  ): void {
    switch (featuresByType[this.name].featureTypeState) {
      case MapFeatureTypeState.NEEDS_POPUP_CHANGE: {
        //dispatch(removeLayer(5));
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
}
