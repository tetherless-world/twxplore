import {PointFeatureTypeStrategy} from "./PointFeatureTypeStrategy";
import {FeatureType} from "../../api/graphqlGlobalTypes";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {Dispatch} from "redux";
import {MapFeatureTypeState} from "../../states/map/MapFeatureTypeState";
import {layerConfigChange, interactionConfigChange} from "kepler.gl/actions";

export class TransmitterFeatureTypeStrategy extends PointFeatureTypeStrategy {
  readonly name = FeatureType.Transmitter;
  dispatchLayerConfigurationActions(kwds: {
    keplerLayerOfFeatureType: any;
    keplerFilterOfFeatureType: any;
    keplerFieldsOfFeatureType: any;
    keplerInteractionConfig: any;
    featureTypeStateOfFeatureType: MapFeatureTypeState;
    dispatch: Dispatch<any>;
  }): void {
    const {
      keplerLayerOfFeatureType,
      keplerInteractionConfig,
      featureTypeStateOfFeatureType,
      dispatch,
    } = kwds;
    switch (featureTypeStateOfFeatureType) {
      case MapFeatureTypeState.NEEDS_POPUP_CHANGE: {
        dispatch(interactionConfigChange(keplerInteractionConfig));
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
  readonly heightAttributeFor3DMap = null;
}
