import {FeatureTypeStrategy} from "../FeatureTypeStrategy";
import {FeatureType} from "../../api/graphqlGlobalTypes";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";

export abstract class PointFeatureTypeStrategy implements FeatureTypeStrategy {
  getClickedQuery(clickedFeatureUri: string): null {
    return null;
  }
  abstract readonly name: FeatureType;
  readonly childFeatureTypes = [];
  readonly expandable = false;
  abstract readonly fieldsToShowOnPopup: FeatureAttributeName[];
}
