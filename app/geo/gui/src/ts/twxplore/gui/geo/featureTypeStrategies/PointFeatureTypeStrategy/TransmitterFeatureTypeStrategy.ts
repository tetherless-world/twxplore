import {PointFeatureTypeStrategy} from "./PointFeatureTypeStrategy";
import {FeatureType} from "../../api/graphqlGlobalTypes";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";

export class TransmitterFeatureTypeStrategy extends PointFeatureTypeStrategy {
  readonly name = FeatureType.Transmitter;
  static readonly instance = new TransmitterFeatureTypeStrategy();
  readonly fieldsToShowOnPopup = [
    FeatureAttributeName.label,
    FeatureAttributeName.type,
    FeatureAttributeName.frequency,
    FeatureAttributeName.postalcode,
    FeatureAttributeName.locality,
  ];
}
