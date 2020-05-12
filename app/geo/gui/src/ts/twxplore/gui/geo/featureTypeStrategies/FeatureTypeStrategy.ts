import {FeatureType, FeatureQuery} from "../api/graphqlGlobalTypes";
import {FeatureAttributeName} from "../states/map/FeatureAttributeName";

export interface FeatureTypeStrategy {
  readonly name: FeatureType;
  readonly childFeatureTypes: FeatureType[];
  readonly expandable: boolean;
  readonly fieldsToShowOnPopup: FeatureAttributeName[];
  getClickedQuery(clickedFeatureUri: string): FeatureQuery | null;
}
