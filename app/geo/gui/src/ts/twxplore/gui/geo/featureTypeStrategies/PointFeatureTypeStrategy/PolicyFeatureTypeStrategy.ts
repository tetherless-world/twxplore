import {PointFeatureTypeStrategy} from "./PointFeatureTypeStrategy";
import {FeatureType} from "../../api/graphqlGlobalTypes";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {Dispatch} from "redux";
import {MapFeatureTypeState} from "../../states/map/MapFeatureTypeState";

export class PolicyFeatureTypeStrategy extends PointFeatureTypeStrategy {
  readonly name = FeatureType.Policy;
  dispatchLayerConfigurationActions(kwds: {
    keplerLayerOfFeatureType: any;
    keplerFilterOfFeatureType: any;
    keplerFieldsOfFeatureType: any;
    keplerInteractionConfig: any;
    featureTypeStateOfFeatureType: MapFeatureTypeState;
    dispatch: Dispatch<any>;
  }): void {
    return;
  }
  static readonly instance = new PolicyFeatureTypeStrategy();
  readonly fieldsToShowOnPopup = [
    FeatureAttributeName.label,
    FeatureAttributeName.type,
    FeatureAttributeName.frequency,
    FeatureAttributeName.postalcode,
    FeatureAttributeName.locality,
  ];
  readonly heightAttributeFor3DMap = null;
}
