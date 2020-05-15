import {FeatureTypeStrategy} from "../FeatureTypeStrategy";
import {FeatureType, FeatureQuery} from "../../api/graphqlGlobalTypes";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {Dispatch} from "redux";
import {FeaturesByType} from "../../states/map/FeaturesByType";

export abstract class PolygonFeatureTypeStrategy
  implements FeatureTypeStrategy {
  layerConfigChange(
    keplerLayers: any,
    layerIndex: number,
    dispatch: Dispatch<any>,
    featuresByType: {
      [featureType: string]: FeaturesByType;
    }
  ): void {
    return;
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
