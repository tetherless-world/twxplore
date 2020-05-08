import {FeatureType, FeatureQuery} from "../api/graphqlGlobalTypes";

export interface FeatureTypeStrategy {
  readonly name: FeatureType;
  readonly childFeatureTypes: FeatureType[];
  readonly expandable: boolean;
  getQuery(clickedFeatureUri: string): FeatureQuery;
}
