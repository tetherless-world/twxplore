import {FeatureType, FeatureQuery} from "../api/graphqlGlobalTypes";
import {FeatureAttributeName} from "../states/map/FeatureAttributeName";

import {DispatchLayerConfigurationActionsParameters} from "./DispatchLayerConfigurationActionsParameters";

export interface FeatureTypeStrategy {
  readonly name: FeatureType;
  readonly childFeatureTypes: FeatureType[];
  readonly expandable: boolean;
  readonly fieldsToShowOnPopup: FeatureAttributeName[];
  readonly heightAttributeFor3DMap: FeatureAttributeName | null;
  getClickedQuery(clickedFeatureUri: string): FeatureQuery | null;
  dispatchLayerConfigurationActions(
    kwds: DispatchLayerConfigurationActionsParameters
  ): void;
}
