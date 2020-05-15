import {PointFeatureTypeStrategy} from "./PointFeatureTypeStrategy";
import {FeatureType} from "../../api/graphqlGlobalTypes";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {Dispatch} from "redux";
import {FeaturesByType} from "../../states/map/FeaturesByType";
import {MapFeatureTypeState} from "../../states/map/MapFeatureTypeState";
import {
  layerTypeChange,
  layerVisConfigChange,
  layerConfigChange,
} from "kepler.gl/actions";
export class TransmissionFeatureTypeStrategy extends PointFeatureTypeStrategy {
  readonly name = FeatureType.Transmission;
  layerConfigChange(
    keplerLayers: any,
    layerIndex: number,
    dispatch: Dispatch<any>,
    featuresByType: {
      [featureType: string]: FeaturesByType;
    }
  ): void {
    switch (featuresByType[this.name].featureTypeState) {
      case MapFeatureTypeState.NEEDS_LAYER_LABEL: {
        const newLayerConfig = {
          label: this.name,
        };
        dispatch(layerConfigChange(keplerLayers[layerIndex], newLayerConfig));
      }
      case MapFeatureTypeState.NEEDS_LAYER_CHANGE: {
        dispatch(layerTypeChange(keplerLayers[layerIndex], "hexagon"));
        break;
      }
      case MapFeatureTypeState.NEEDS_3D_ENABLED: {
        dispatch(
          layerVisConfigChange(keplerLayers[layerIndex], {
            enabled3d: true,
          })
        );
        break;
      }
      default: {
      }
    }
  }
  static readonly instance = new TransmissionFeatureTypeStrategy();
  readonly fieldsToShowOnPopup = [
    FeatureAttributeName.label,
    FeatureAttributeName.type,
    FeatureAttributeName.frequency,
    FeatureAttributeName.timestamp,
    FeatureAttributeName.transmissionPower,
    FeatureAttributeName.postalcode,
    FeatureAttributeName.locality,
  ];
}
