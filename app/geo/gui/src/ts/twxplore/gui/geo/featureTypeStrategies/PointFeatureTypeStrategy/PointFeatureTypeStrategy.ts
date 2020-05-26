import {FeatureTypeStrategy} from "../FeatureTypeStrategy";
import {FeatureType} from "../../api/graphqlGlobalTypes";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {Dispatch} from "redux";
import {FeaturesByType} from "../../states/map/FeaturesByType";

export abstract class PointFeatureTypeStrategy implements FeatureTypeStrategy {
  getClickedQuery(clickedFeatureUri: string): null {
    return null;
  }
  abstract dispatchLayerConfigurationActions(
    keplerLayerOfFeatureType: any,
    keplerFiltersOfFeatureType: any,
    keplerFieldsOfFeatureType: any,
    dispatch: Dispatch<any>,
    featuresByType: {
      [featureType: string]: FeaturesByType;
    }
  ): void;
  abstract readonly name: FeatureType;
  readonly childFeatureTypes = [];
  readonly expandable = false;
  abstract readonly fieldsToShowOnPopup: FeatureAttributeName[];
}
