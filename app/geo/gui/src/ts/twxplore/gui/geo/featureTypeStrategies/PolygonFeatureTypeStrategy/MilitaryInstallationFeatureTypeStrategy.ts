import {PolygonFeatureTypeStrategy} from "./PolygonFeatureTypeStrategy";
import {FeatureType} from "../../api/graphqlGlobalTypes";

export class MilitaryInstallationFeatureTypeStrategy extends PolygonFeatureTypeStrategy {
  readonly name = FeatureType.MilitaryInstallation;
  readonly withinFeatureTypes = [
    FeatureType.Transmission,
    FeatureType.Transmitter,
  ];
  static readonly instance = new MilitaryInstallationFeatureTypeStrategy();
}
