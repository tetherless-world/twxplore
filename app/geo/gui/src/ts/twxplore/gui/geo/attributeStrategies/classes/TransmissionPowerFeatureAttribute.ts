import {setInitialFiltersNumeric} from "../functions/setInitialFilters/setInitialFiltersNumeric";
import {FeatureAttribute} from "./FeatureAttribute";
import {MapFeatureAttributeState} from "../../states/map/MapFeatureAttributeState/MapFeatureAttributeState";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {KeplerFilterType} from "../../states/map/KeplerFilterType";
import {KeplerFieldType} from "../../states/map/KeplerFieldType";
import {TypeOfFeatureAttribute} from "../../states/map/TypeOfFeatureAttribute";
import {Dispatch} from "redux";
import {buildInitialFeatureAttributeStateNumeric} from "../functions/buildInitialFeatureAtttributeState/buildInitialFeatureAttributeStateNumeric";
import {MapFeature} from "../../states/map/MapFeature";
import {updateNumericAttributeStateOfFeatureType} from "../functions/updateAttributeStateOfFeatureType/updateNumericAttributeStateOfFeatureType";

export class TransmissionPowerFeatureAttribute implements FeatureAttribute {
  updateAttributeStatesOfFeatureType(
    attributeStatesOfFeatureType: {
      [featureAttributeName: string]: MapFeatureAttributeState;
    },
    addedFeature: MapFeature
  ): void {
    updateNumericAttributeStateOfFeatureType(
      attributeStatesOfFeatureType,
      addedFeature,
      this.name
    );
  }
  buildInitialFeatureAttributeState(attributeStatesOfFeatureType: {
    [featureAttributeName: string]: MapFeatureAttributeState;
  }): void {
    buildInitialFeatureAttributeStateNumeric(
      attributeStatesOfFeatureType,
      this.name
    );
  }
  setInitialFilters(
    filterIndexOfAttribute: number,
    stateOfAttribute: MapFeatureAttributeState,
    dispatch: Dispatch<any>
  ): void {
    setInitialFiltersNumeric(
      filterIndexOfAttribute,
      this.name,
      stateOfAttribute,
      this.KeplerFilterType,
      dispatch
    );
  }
  static readonly instance = new TransmissionPowerFeatureAttribute();
  readonly name = FeatureAttributeName.transmissionPower;
  readonly KeplerFilterType = KeplerFilterType.RANGE;
  readonly KeplerFieldType = KeplerFieldType.INTEGER;
  readonly ignore = false;
  readonly typeOf = TypeOfFeatureAttribute.NUMBER;
}
