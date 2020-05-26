import {PointFeatureTypeStrategy} from "./PointFeatureTypeStrategy";
import {FeatureType} from "../../api/graphqlGlobalTypes";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";

export class TransmissionFeatureTypeStrategy extends PointFeatureTypeStrategy {
  readonly name = FeatureType.Transmission;
  static readonly instance = new TransmissionFeatureTypeStrategy();
  readonly fieldsToShowOnPopup = [
    FeatureAttributeName.label,
    FeatureAttributeName.type,
    FeatureAttributeName.frequencyString,
    FeatureAttributeName.timestampString,
    FeatureAttributeName.transmissionPowerString,
    FeatureAttributeName.postalcode,
    FeatureAttributeName.locality,
  ];
}
