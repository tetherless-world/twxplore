import {PolygonFeatureTypeStrategy} from "./PolygonFeatureTypeStrategy";
import {FeatureType} from "../../api/graphqlGlobalTypes";

export class MetropolitanDivisionFeatureTypeStrategy extends PolygonFeatureTypeStrategy {
  readonly name = FeatureType.MetropolitanDivision;
  readonly withinFeatureTypes = [
    FeatureType.Transmission,
    FeatureType.Transmitter,
  ];
}
