import {PolygonFeatureTypeStrategy} from "./PolygonFeatureTypeStrategy";
import {FeatureType} from "../../api/graphqlGlobalTypes";

export class CountyFeatureTypeStrategy extends PolygonFeatureTypeStrategy {
  readonly name = FeatureType.County;
  readonly childFeatureTypes = [
    FeatureType.Transmission,
    FeatureType.Transmitter,
  ];
  static readonly instance = new CountyFeatureTypeStrategy();
}
