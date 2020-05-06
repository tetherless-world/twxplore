import {FeatureTypeStrategy} from "../FeatureTypeStrategy";

export abstract class PolygonFeatureTypeStrategy
  implements FeatureTypeStrategy {
  abstract readonly name: string;
  abstract readonly withinFeatureTypes: string[];
  readonly expandable = true;
}
