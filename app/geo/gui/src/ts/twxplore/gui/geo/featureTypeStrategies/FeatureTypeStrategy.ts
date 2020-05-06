import {FeatureType} from "../api/graphqlGlobalTypes";

export interface FeatureTypeStrategy {
  readonly name: FeatureType;
  readonly childFeatureTypes: string[];
  readonly expandable: boolean;
}
