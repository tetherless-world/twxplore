import {FeatureAttribute} from "./FeatureAttribute";
import {FeatureAttributeName} from "../states/map/FeatureAttributeName";
import {FilterType} from "../states/map/FilterType";
import {TypeOfFeatureAttribute} from "../states/map/TypeOfFeatureAttribute";
import {FieldType} from "../states/map/FieldType";
import {setInitialFiltersNumeric} from "../functions/setInitialFiltersNumeric";
import {MapFeatureAttributeState} from "../../states/map/MapFeatureAttributeState/MapFeatureAttributeState";

export class FrequencyFeatureAttribute implements FeatureAttribute {
  setInitialFilters(
    filterIndexOfAttribute: number,
    stateOfAttribute: MapFeatureAttributeState
  ): void {
    setInitialFiltersNumeric(
      filterIndexOfAttribute,
      this.name,
      stateOfAttribute,
      this.fieldType
    );
  }
  static readonly instance = new FrequencyFeatureAttribute();

  readonly name = FeatureAttributeName.transmissionPower;
  readonly typeOf = TypeOfFeatureAttribute.NUMBER;
  readonly filterType = FilterType.RANGE;
  readonly fieldType = FieldType.INTEGER;

  readonly ignore = false;
}
