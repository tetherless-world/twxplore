import {FeatureTypeStrategy} from "../FeatureTypeStrategy";
import {FeatureType} from "../../api/graphqlGlobalTypes";

export abstract class PointFeatureTypeStrategy implements FeatureTypeStrategy {
  abstract readonly name: FeatureType;
  readonly childFeatureTypes = [];
  readonly expandable = false;
}
