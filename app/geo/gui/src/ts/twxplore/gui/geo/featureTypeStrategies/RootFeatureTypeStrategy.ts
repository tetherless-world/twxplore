import {FeatureTypeStrategy} from "./FeatureTypeStrategy";
import {FeatureType, FeatureQuery} from "../api/graphqlGlobalTypes";
import {NEW_YORK_STATE_FEATURE_URI} from "../states/map/NEW_YORK_STATE_FEATURE_URI";

export class RootFeatureTypeStrategy implements FeatureTypeStrategy {
  getQuery(clickedFeatureUri: string): FeatureQuery {
    return {
      onlyFeatureUri: NEW_YORK_STATE_FEATURE_URI,
    };
  }
  readonly name = FeatureType.Root;
  readonly childFeatureTypes = [FeatureType.State];
  static readonly instance = new RootFeatureTypeStrategy();
  readonly expandable = true;
  readonly fieldsToShowOnPopup = [];
}
