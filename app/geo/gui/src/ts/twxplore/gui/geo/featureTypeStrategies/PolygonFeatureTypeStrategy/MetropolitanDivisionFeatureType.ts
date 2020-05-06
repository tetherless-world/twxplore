import {PolygonFeatureTypeStrategy} from "./PolygonFeatureTypeStrategy";
import {FeatureType} from "../../api/graphqlGlobalTypes";

export class MetropolitanDivisionFeatureTypeStrategy extends PolygonFeatureTypeStrategy {
  readonly name = FeatureType.MetropolitanDivision;
  readonly childFeatureTypes = [
    FeatureType.Transmission,
    FeatureType.Transmitter,
  ];
  static readonly instance = new MetropolitanDivisionFeatureTypeStrategy();
}
