import {FeatureType, FeatureQuery} from "../api/graphqlGlobalTypes";
import {FeatureAttributeName} from "../states/map/FeatureAttributeName";
import {Dispatch} from "redux";
import {FeaturesByType} from "../states/map/FeaturesByType";

export interface FeatureTypeStrategy {
  readonly name: FeatureType;
  readonly childFeatureTypes: FeatureType[];
  readonly expandable: boolean;
  readonly fieldsToShowOnPopup: FeatureAttributeName[];
  getClickedQuery(clickedFeatureUri: string): FeatureQuery | null;
  layerConfigChange(
    keplerLayers: any,
    dispatch: Dispatch<any>,
    featuresByType: FeaturesByType
  ): void;
}
