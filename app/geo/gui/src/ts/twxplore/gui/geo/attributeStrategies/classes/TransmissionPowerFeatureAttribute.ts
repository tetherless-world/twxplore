import {FilterType} from "../states/map/FilterType";
import {FeatureAttributeName} from "../states/map/FeatureAttributeName";
import {FeatureAttribute} from "./FeatureAttribute";
import {TypeOfFeatureAttribute} from "../states/map/TypeOfFeatureAttribute";
import {FieldType} from "../states/map/FieldType";
import {setInitialFiltersNumeric} from "../functions/setInitialFiltersNumeric";

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
      this.fieldType
    );
  }
  readonly name = FeatureAttributeName.transmissionPower;
  readonly filterType = FilterType.RANGE;
  readonly fieldType = FieldType.INTEGER;
  readonly ignore = false;
  readonly typeOf = TypeOfFeatureAttribute.NUMBER;
}
