import {FeatureTypeStrategy} from "../FeatureTypeStrategy";
import {FeatureType} from "../../api/graphqlGlobalTypes";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {Dispatch} from "redux";
import {FeaturesByType} from "../../states/map/FeaturesByType";
import {MapFeatureTypeState} from "../../states/map/MapFeatureTypeState";

export abstract class PointFeatureTypeStrategy implements FeatureTypeStrategy {
  getClickedQuery(clickedFeatureUri: string): null {
    return null;
  }
  abstract dispatchLayerConfigurationActions(kwds: {
    keplerLayerOfFeatureType: any;
    keplerFilterOfFeatureType: any;
    keplerFieldsOfFeatureType: any;
    keplerInteractionConfig: any;
    featureTypeStateOfFeatureType: MapFeatureTypeState;
    dispatch: Dispatch<any>;
    featuresByType: {
      [featureType: string]: FeaturesByType;
    };
  }): void;
  abstract readonly name: FeatureType;
  readonly childFeatureTypes = [];
  readonly expandable = false;
  abstract readonly fieldsToShowOnPopup: FeatureAttributeName[];
}
