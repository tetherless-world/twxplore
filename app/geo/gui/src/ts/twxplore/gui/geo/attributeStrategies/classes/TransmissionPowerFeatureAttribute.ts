import {setInitialFiltersNumeric} from "../functions/setInitialFiltersNumeric";
import {FeatureAttribute} from "./FeatureAttribute";
import {MapFeatureAttributeState} from "../../states/map/MapFeatureAttributeState/MapFeatureAttributeState";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {FilterType} from "../../states/map/FilterType";
import {FieldType} from "../../states/map/FieldType";
import {TypeOfFeatureAttribute} from "../../states/map/TypeOfFeatureAttribute";

export class TransmissionPowerFeatureAttribute implements FeatureAttribute {
  static readonly instance = new TransmissionPowerFeatureAttribute();
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
  readonly name = FeatureAttributeName.transmissionPower;
  readonly filterType = FilterType.RANGE;
  readonly fieldType = FieldType.INTEGER;
  readonly ignore = false;
  readonly typeOf = TypeOfFeatureAttribute.NUMBER;
}
