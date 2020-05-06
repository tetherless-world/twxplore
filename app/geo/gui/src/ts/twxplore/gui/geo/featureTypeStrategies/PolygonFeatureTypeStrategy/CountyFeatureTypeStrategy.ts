import {PolygonFeatureTypeStrategy} from "./PolygonFeatureTypeStrategy";
import {FeatureType} from "../../api/graphqlGlobalTypes";

export class CountyFeatureTypeStrategy extends PolygonFeatureTypeStrategy {
  readonly name = FeatureType.County;
  readonly withinFeatureTypes = [
    FeatureType.Transmission,
    FeatureType.Transmitter,
  ];
}
