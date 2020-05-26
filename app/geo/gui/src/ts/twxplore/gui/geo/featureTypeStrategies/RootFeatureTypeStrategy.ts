import {FeatureTypeStrategy} from "./FeatureTypeStrategy";
import {FeatureType, FeatureQuery} from "../api/graphqlGlobalTypes";
import {NEW_YORK_STATE_FEATURE_URI} from "../states/map/NEW_YORK_STATE_FEATURE_URI";
import {Dispatch} from "redux";
import {FeaturesByType} from "../states/map/FeaturesByType";

export class RootFeatureTypeStrategy implements FeatureTypeStrategy {
  getClickedQuery(clickedFeatureUri: string): FeatureQuery {
    return {
      onlyFeatureUri: NEW_YORK_STATE_FEATURE_URI,
    };
  }
  dispatchLayerConfigurationActions(
    keplerLayerOfFeatureType: any,
    keplerFiltersOfFeatureType: any,
    keplerFieldsOfFeatureType: any,
    dispatch: Dispatch<any>,
    featuresByType: {
      [featureType: string]: FeaturesByType;
    }
  ): void {
    return;
  }
  readonly name = FeatureType.Root;
  readonly childFeatureTypes = [FeatureType.State];
  static readonly instance = new RootFeatureTypeStrategy();
  readonly expandable = true;
  readonly fieldsToShowOnPopup = [];
}
