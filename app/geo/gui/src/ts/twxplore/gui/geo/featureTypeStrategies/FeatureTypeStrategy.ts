import {FeatureType, FeatureQuery} from "../api/graphqlGlobalTypes";
import {FeatureAttributeName} from "../states/map/FeatureAttributeName";
import {Dispatch} from "redux";
import {MapFeatureTypeState} from "../states/map/MapFeatureTypeState";

export interface FeatureTypeStrategy {
  readonly name: FeatureType;
  readonly childFeatureTypes: FeatureType[];
  readonly expandable: boolean;
  readonly fieldsToShowOnPopup: FeatureAttributeName[];
  readonly heightAttributeFor3DMap: FeatureAttributeName | null;
  getClickedQuery(clickedFeatureUri: string): FeatureQuery | null;
  dispatchLayerConfigurationActions(kwds: {
    keplerLayerOfFeatureType: any;
    keplerFilterOfFeatureType: any;
    keplerFieldsOfFeatureType: any;
    keplerInteractionConfig: any;
    featureTypeStateOfFeatureType: MapFeatureTypeState;
    dispatch: Dispatch<any>;
  }): void;
}
