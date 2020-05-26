import {PointFeatureTypeStrategy} from "./PointFeatureTypeStrategy";
import {FeatureType} from "../../api/graphqlGlobalTypes";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {MapFeatureTypeState} from "../../states/map/MapFeatureTypeState";
import {
  layerTypeChange,
  layerVisConfigChange,
  layerConfigChange,
  layerVisualChannelConfigChange,
  interactionConfigChange,
  //removeLayer,
} from "kepler.gl/actions";
import {DispatchLayerConfigurationActionsParameters} from "../DispatchLayerConfigurationActionsParameters";
export class TransmissionFeatureTypeStrategy extends PointFeatureTypeStrategy {
  readonly name = FeatureType.Transmission;
  dispatchLayerConfigurationActions(
    kwds: DispatchLayerConfigurationActionsParameters
  ): void {
    const {
      keplerLayerOfFeatureType,
      keplerFilterOfFeatureType,
      keplerFieldsOfFeatureType,
      keplerInteractionConfig,
      featureTypeStateOfFeatureType,
      dispatch,
    } = kwds;
    //Check the featureTypeState of Transmissions
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
      }
      case MapFeatureTypeState.NEEDS_LAYER_CHANGE: {
        dispatch(layerTypeChange(keplerLayerOfFeatureType, "hexagon"));
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
            lat: {value: FeatureAttributeName.y, fieldIdx: latFieldIdx},
            lng: {value: FeatureAttributeName.x, fieldIdx: lngFieldIdx},
          },
        };
        dispatch(layerConfigChange(keplerLayerOfFeatureType, newLayerConfig));
        break;
      }
      case MapFeatureTypeState.NEEDS_3D_ENABLED: {
        dispatch(
          layerVisConfigChange(keplerLayerOfFeatureType, {
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
        ).tableFieldIndex;
        const channel = "size";
        dispatch(
          layerVisualChannelConfigChange(
            keplerLayerOfFeatureType,
            {
              sizeField: {
                name: FeatureAttributeName.transmissionPower,
                format: "",
                tableFieldIndex: keplerTableFieldIndexOfAttribute,
                type: "integer",
                analyzerType: "INT",
                id: FeatureAttributeName.transmissionPower,
                filterProps: keplerFilterOfFeatureType,
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
  readonly heightAttributeFor3DMap = FeatureAttributeName.transmissionPower;
}
