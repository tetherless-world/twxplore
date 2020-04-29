import {FeatureAttribute} from "./FeatureAttribute";
import {MapFeatureAttributeState} from "../../states/map/MapFeatureAttributeState/MapFeatureAttributeState";
import {setInitialFiltersNumeric} from "../functions/setInitialFilters/setInitialFiltersNumeric";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {TypeOfFeatureAttribute} from "../../states/map/TypeOfFeatureAttribute";
import {FilterType} from "../../states/map/FilterType";
import {FieldType} from "../../states/map/FieldType";
import {Dispatch} from "redux";
import {buildInitialFeatureAttributeStateNumeric} from "../functions/buildInitialFeatureAtttributeState/buildInitialFeatureAttributeStateNumeric";
import {MapFeature} from "../../states/map/MapFeature";
import {updateNumericAttributeStatesOfFeatureType} from "../functions/updateAttributeStatesOfFeatureType/updateNumericAttributeStatesOfFeatureType";

export class FrequencyFeatureAttribute implements FeatureAttribute {
  updateAttributeStatesOfFeatureType(
    attributeStatesOfFeatureType: {
      [featureAttributeName: string]: MapFeatureAttributeState;
    },
    addedFeature: MapFeature
  ): void {
    updateNumericAttributeStatesOfFeatureType(
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
      this.filterType,
      dispatch
    );
  }
  static readonly instance = new FrequencyFeatureAttribute();
  readonly name = FeatureAttributeName.frequency;
  readonly typeOf = TypeOfFeatureAttribute.NUMBER;
  readonly filterType = FilterType.RANGE;
  readonly fieldType = FieldType.INTEGER;
  readonly ignore = false;
}
