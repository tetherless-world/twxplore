import {FeatureAttribute} from "./FeatureAttribute";
import {MapFeatureAttributeState} from "../../states/map/MapFeatureAttributeState/MapFeatureAttributeState";
import {setInitialFiltersNumeric} from "../functions/setInitialFiltersNumeric";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {TypeOfFeatureAttribute} from "../../states/map/TypeOfFeatureAttribute";
import {FilterType} from "../../states/map/FilterType";
import {FieldType} from "../../states/map/FieldType";

export class FrequencyFeatureAttribute implements FeatureAttribute {
  setInitialFilters(
    filterIndexOfAttribute: number,
    stateOfAttribute: MapFeatureAttributeState
  ): void {
    setInitialFiltersNumeric(
      filterIndexOfAttribute,
      this.name,
      stateOfAttribute,
      this.filterType
    );
  }
  static readonly instance = new FrequencyFeatureAttribute();

  readonly name = FeatureAttributeName.transmissionPower;
  readonly typeOf = TypeOfFeatureAttribute.NUMBER;
  readonly filterType = FilterType.RANGE;
  readonly fieldType = FieldType.INTEGER;

  readonly ignore = false;
}
