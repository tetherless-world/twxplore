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
  layerVisualChannelConfigChange,
  //removeLayer,
} from "kepler.gl/actions";
export class TransmissionFeatureTypeStrategy extends PointFeatureTypeStrategy {
  readonly name = FeatureType.Transmission;
  dispatchLayerConfigurationActions(
    keplerLayers: any,
    layerIndex: number,
    dispatch: Dispatch<any>,
    featuresByType: {
      [featureType: string]: FeaturesByType;
    },
    keplerFieldsOfFeatureType: any
  ): void {
    //Check the featureTypeState of Transmissions
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
      case MapFeatureTypeState.NEEDS_LAYER_CHANGE: {
        dispatch(layerTypeChange(keplerLayers[layerIndex], "hexagon"));
        break;
      }
      case MapFeatureTypeState.NEEDS_LNG_AND_LAT: {
        const latFieldIdx = keplerFieldsOfFeatureType.findIndex(
          (keplerField: {id: string}) => keplerField.id === "Y"
        );
        const lngFieldIdx = keplerFieldsOfFeatureType.findIndex(
          (keplerField: {id: string}) => keplerField.id === "X"
        );
        const newLayerConfig = {
          columns: {
            lat: {value: "Y", fieldIdx: latFieldIdx},
            lng: {value: "X", fieldIdx: lngFieldIdx},
          },
        };
        dispatch(layerConfigChange(keplerLayers[layerIndex], newLayerConfig));
        break;
      }
      case MapFeatureTypeState.NEEDS_3D_ENABLED: {
        dispatch(
          layerVisConfigChange(keplerLayers[layerIndex], {
            enable3d: true,
          })
        );

        break;
      }
      case MapFeatureTypeState.NEEDS_HEIGHT_ATTRIBUTE: {
        const keplerTableFieldIndexOfAttribute = keplerFieldsOfFeatureType.find(
          (keplerFieldOfFeatureType: any) =>
            keplerFieldOfFeatureType.name ===
            FeatureAttributeName.transmissionPower
        );
        const channel = "size";
        dispatch(
          layerVisualChannelConfigChange(
            keplerLayers[layerIndex],
            {
              sizeField: {
                name: FeatureAttributeName.transmissionPower,
                format: "",
                tableFieldIndex: keplerTableFieldIndexOfAttribute,
                type: "integer",
                analyzerType: "INT",
                id: FeatureAttributeName.transmissionPower,
              },
            },
            channel
          )
        );
        break;
      }
      default: {
        break;
      }
    }
  }
  static readonly instance = new TransmissionFeatureTypeStrategy();
  readonly fieldsToShowOnPopup = [
    FeatureAttributeName.label,
    FeatureAttributeName.type,
    FeatureAttributeName.frequencyString,
    FeatureAttributeName.timestampString,
    FeatureAttributeName.transmissionPowerString,
    FeatureAttributeName.postalcode,
    FeatureAttributeName.locality,
  ];
}
