import {PointFeatureTypeStrategy} from "./PointFeatureTypeStrategy";
import {FeatureType} from "../../api/graphqlGlobalTypes";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {FeaturesByType} from "../../states/map/FeaturesByType";
import {Dispatch} from "redux";
import {MapFeatureTypeState} from "../../states/map/MapFeatureTypeState";
import {layerConfigChange, interactionConfigChange} from "kepler.gl/actions";

export class TransmitterFeatureTypeStrategy extends PointFeatureTypeStrategy {
  readonly name = FeatureType.Transmitter;
  dispatchLayerConfigurationActions(
    keplerLayerOfFeatureType: any,
    keplerFiltersOfFeatureType: any,
    keplerFieldsOfFeatureType: any,
    keplerInteractionConfigOfFeatureType: any,
    dispatch: Dispatch<any>,
    featuresByType: {
      [featureType: string]: FeaturesByType;
    }
  ): void {
    switch (featuresByType[this.name].featureTypeState) {
      case MapFeatureTypeState.NEEDS_POPUP_CHANGE: {
        dispatch(interactionConfigChange(keplerInteractionConfigOfFeatureType));
        dispatch(
          layerConfigChange(keplerLayerOfFeatureType, {isConfigActive: true})
        );
        const newLayerConfig = {
          label: this.name,
        };
        dispatch(layerConfigChange(keplerLayerOfFeatureType, newLayerConfig));
        break;
      }

      default: {
        break;
      }
    }
  }
  static readonly instance = new TransmitterFeatureTypeStrategy();
  readonly fieldsToShowOnPopup = [
    FeatureAttributeName.label,
    FeatureAttributeName.type,
    FeatureAttributeName.frequencyString,
    FeatureAttributeName.postalcode,
    FeatureAttributeName.locality,
  ];
}
