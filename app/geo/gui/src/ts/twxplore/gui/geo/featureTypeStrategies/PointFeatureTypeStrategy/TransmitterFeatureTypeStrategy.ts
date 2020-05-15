import {PointFeatureTypeStrategy} from "./PointFeatureTypeStrategy";
import {FeatureType} from "../../api/graphqlGlobalTypes";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {FeaturesByType} from "../../states/map/FeaturesByType";
import {Dispatch} from "redux";

export class TransmitterFeatureTypeStrategy extends PointFeatureTypeStrategy {
  readonly name = FeatureType.Transmitter;
  layerConfigChange(
    keplerLayers: any,
    dispatch: Dispatch<any>,
    featuresByType: FeaturesByType
  ): void {
    return;
  }
  static readonly instance = new TransmitterFeatureTypeStrategy();
  readonly fieldsToShowOnPopup = [
    FeatureAttributeName.label,
    FeatureAttributeName.type,
    FeatureAttributeName.frequency,
    FeatureAttributeName.postalcode,
    FeatureAttributeName.locality,
  ];
}
