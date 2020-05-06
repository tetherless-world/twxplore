import {PolygonFeatureTypeStrategy} from "./PolygonFeatureTypeStrategy";
import {FeatureType} from "../../api/graphqlGlobalTypes";

export class StateFeatureTypeStrategy extends PolygonFeatureTypeStrategy {
  readonly name = FeatureType.State;
  readonly withinFeatureTypes = [
    FeatureType.County,
    FeatureType.MetropolitanDivision,
    FeatureType.MilitaryInstallation,
  ];
  static readonly instance = new StateFeatureTypeStrategy();
}
