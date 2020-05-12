import {FeatureTypeStrategy} from "../FeatureTypeStrategy";
import {FeatureType, FeatureQuery} from "../../api/graphqlGlobalTypes";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";

export abstract class PointFeatureTypeStrategy implements FeatureTypeStrategy {
  getQuery(clickedFeatureUri: string): FeatureQuery {
    return {
      withinFeatureUri: clickedFeatureUri,
      types: this.childFeatureTypes,
    };
  }
  abstract readonly name: FeatureType;
  readonly childFeatureTypes = [];
  readonly expandable = false;
  abstract readonly fieldsToShowOnPopup: FeatureAttributeName[];
}
