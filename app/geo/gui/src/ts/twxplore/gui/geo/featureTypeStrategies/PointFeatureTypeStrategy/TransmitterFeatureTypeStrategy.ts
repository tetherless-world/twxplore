import {PointFeatureTypeStrategy} from "./PointFeatureTypeStrategy";
import {FeatureType} from "../../api/graphqlGlobalTypes";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {FeaturesByType} from "../../states/map/FeaturesByType";
import {Dispatch} from "redux";
import {MapFeatureTypeState} from "../../states/map/MapFeatureTypeState";
import {
  layerConfigChange,
  //removeLayer,
} from "kepler.gl/actions";

export class TransmitterFeatureTypeStrategy extends PointFeatureTypeStrategy {
  readonly name = FeatureType.Transmitter;
  dispatchLayerConfigurationActions(
    keplerLayers: any,
    layerIndex: number,
    dispatch: Dispatch<any>,
    featuresByType: {
      [featureType: string]: FeaturesByType;
    },
    keplerFieldsOfFeatureType: any
  ): void {
    switch (featuresByType[this.name].featureTypeState) {
      case MapFeatureTypeState.NEEDS_LAYER_LABEL: {
        //dispatch(removeLayer(5));
        dispatch(
          layerConfigChange(keplerLayers[layerIndex], {isConfigActive: true})
        );
        const newLayerConfig = {
          label: this.name,
        };
        dispatch(layerConfigChange(keplerLayers[layerIndex], newLayerConfig));
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
    FeatureAttributeName.frequency,
    FeatureAttributeName.postalcode,
    FeatureAttributeName.locality,
  ];
}
