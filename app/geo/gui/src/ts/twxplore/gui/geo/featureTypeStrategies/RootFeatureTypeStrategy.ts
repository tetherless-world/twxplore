import {FeatureTypeStrategy} from "./FeatureTypeStrategy";
import {FeatureType, FeatureQuery} from "../api/graphqlGlobalTypes";
import {NEW_YORK_STATE_FEATURE_URI} from "../states/map/NEW_YORK_STATE_FEATURE_URI";
import {DispatchLayerConfigurationActionsParameters} from "./DispatchLayerConfigurationActionsParameters";

export class RootFeatureTypeStrategy implements FeatureTypeStrategy {
  getClickedQuery(clickedFeatureUri: string): FeatureQuery {
    return {
      onlyFeatureUri: NEW_YORK_STATE_FEATURE_URI,
    };
  }
  dispatchLayerConfigurationActions(
    kwds: DispatchLayerConfigurationActionsParameters
  ): void {
    return;
  }
  readonly name = FeatureType.Root;
  readonly childFeatureTypes = [FeatureType.State];
  static readonly instance = new RootFeatureTypeStrategy();
  readonly expandable = true;
  readonly fieldsToShowOnPopup = [];
  readonly heightAttributeFor3DMap = null;
}
