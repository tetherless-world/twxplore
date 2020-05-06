import {FeatureTypeStrategy} from "../FeatureTypeStrategy";

export abstract class PointFeatureTypeStrategy implements FeatureTypeStrategy {
  abstract readonly name: string;
  readonly withinFeatureTypes = [];
  readonly expandable = false;
}
