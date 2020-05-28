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
import {KeplerLayerType} from "../../states/map/KeplerLayerType";
export class TransmissionFeatureTypeStrategy extends PointFeatureTypeStrategy {
  readonly name = FeatureType.Transmission;
  dispatchLayerConfigurationActions(
    kwds: DispatchLayerConfigurationActionsParameters
  ): void {
    const {
      keplerLayerOfFeatureType,
      keplerFilterOfFeatureType,
      keplerFieldsOfFeatureType,
      keplerInteractionConfigCopy,
      featureTypeStateOfFeatureType,
      currentKeplerLayerTypeOfFeatureType,
      dispatch,
    } = kwds;
    //Check the featureTypeState of Transmissions
    switch (featureTypeStateOfFeatureType) {
      case MapFeatureTypeState.NEEDS_POPUP_CHANGE: {
        dispatch(interactionConfigChange(keplerInteractionConfigCopy));
        dispatch(
          layerConfigChange(keplerLayerOfFeatureType, {isConfigActive: true})
        );
        const newLayerConfig = {
          label: this.name,
        };
        dispatch(layerConfigChange(keplerLayerOfFeatureType, newLayerConfig));
        break;
      }
      case MapFeatureTypeState.NEEDS_LAYER_TYPE_CHANGE: {
        if (currentKeplerLayerTypeOfFeatureType === KeplerLayerType.GEOJSON)
          dispatch(
            layerTypeChange(keplerLayerOfFeatureType, KeplerLayerType.HEXAGON)
          );
        else
          dispatch(
            layerTypeChange(keplerLayerOfFeatureType, KeplerLayerType.GEOJSON)
          );
        break;
      }
      case MapFeatureTypeState.NEEDS_COLUMNS: {
        var newLayerConfig;
        if (currentKeplerLayerTypeOfFeatureType === KeplerLayerType.HEXAGON) {
          const latFieldIdx = keplerFieldsOfFeatureType.findIndex(
            (keplerField: {id: string}) =>
              keplerField.id === FeatureAttributeName.y
          );
          const lngFieldIdx = keplerFieldsOfFeatureType.findIndex(
            (keplerField: {id: string}) =>
              keplerField.id === FeatureAttributeName.x
          );
          newLayerConfig = {
            columns: {
              lat: {value: FeatureAttributeName.y, fieldIdx: latFieldIdx},
              lng: {value: FeatureAttributeName.x, fieldIdx: lngFieldIdx},
            },
          };
        } else {
          const _geojsonIndex = keplerFieldsOfFeatureType.findIndex(
            (keplerField: {id: string}) =>
              keplerField.id === FeatureAttributeName._geojson
          );
          newLayerConfig = {
            columns: {
              geojson: {
                value: FeatureAttributeName._geojson,
                fieldIdx: _geojsonIndex,
              },
            },
          };
        }
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
      case MapFeatureTypeState.NEEDS_LAYER_COLOR_CHANGE: {
        if (currentKeplerLayerTypeOfFeatureType === KeplerLayerType.HEXAGON) {
          dispatch(
            layerVisConfigChange(keplerLayerOfFeatureType, {
              colorRange: {
                name: "ColorBrewer Blues-6",
                type: "singlehue",
                category: "ColorBrewer",
                colors: [
                  "#eff3ff",
                  "#c6dbef",
                  "#9ecae1",
                  "#6baed6",
                  "#3182bd",
                  "#08519c",
                ],
              },
            })
          );
        } else {
          dispatch(
            layerVisConfigChange(keplerLayerOfFeatureType, {filled: true})
          );
          dispatch(
            layerVisConfigChange(keplerLayerOfFeatureType, {stroked: false})
          );
          dispatch(
            layerConfigChange(keplerLayerOfFeatureType, {
              color: [169, 203, 237],
            })
          );
        }
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
  readonly layerTypeToggleable = true;
}
