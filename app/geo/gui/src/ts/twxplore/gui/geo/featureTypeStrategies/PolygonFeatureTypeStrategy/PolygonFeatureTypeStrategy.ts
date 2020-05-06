import {FeatureTypeStrategy} from "../FeatureTypeStrategy";
import {FeatureType} from "../../api/graphqlGlobalTypes";

export abstract class PolygonFeatureTypeStrategy
  implements FeatureTypeStrategy {
  abstract readonly name: FeatureType;
  abstract readonly childFeatureTypes: FeatureType[];
  readonly expandable = true;
}
