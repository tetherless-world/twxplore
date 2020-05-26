import {FeatureTypeStrategy} from "./FeatureTypeStrategy";
import {FeatureType, FeatureQuery} from "../api/graphqlGlobalTypes";
import {NEW_YORK_STATE_FEATURE_URI} from "../states/map/NEW_YORK_STATE_FEATURE_URI";
import {Dispatch} from "redux";
import {MapFeatureTypeState} from "../states/map/MapFeatureTypeState";

export class RootFeatureTypeStrategy implements FeatureTypeStrategy {
  getClickedQuery(clickedFeatureUri: string): FeatureQuery {
    return {
      onlyFeatureUri: NEW_YORK_STATE_FEATURE_URI,
    };
  }
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
  readonly name = FeatureType.Root;
  readonly childFeatureTypes = [FeatureType.State];
  static readonly instance = new RootFeatureTypeStrategy();
  readonly expandable = true;
  readonly fieldsToShowOnPopup = [];
}
