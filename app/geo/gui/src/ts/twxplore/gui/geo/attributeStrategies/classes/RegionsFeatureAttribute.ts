import {FeatureAttribute} from "./FeatureAttribute";
import {setInitialFiltersString} from "../functions/setInitialFiltersString";
import {MapFeatureAttributeState} from "../../states/map/MapFeatureAttributeState/MapFeatureAttributeState";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {FilterType} from "../../states/map/FilterType";
import {FieldType} from "../../states/map/FieldType";
import {TypeOfFeatureAttribute} from "../../states/map/TypeOfFeatureAttribute";

export class RegionsFeatureAttribute implements FeatureAttribute {
  static readonly instance = new RegionsFeatureAttribute();
  setInitialFilters(
    filterIndexOfAttribute: number,
    stateOfAttribute: MapFeatureAttributeState
  ): void {
    setInitialFiltersString(
      filterIndexOfAttribute,
      this.name,
      stateOfAttribute,
      this.filterType
    );
  }
  readonly name = FeatureAttributeName.regions;
  readonly filterType = FilterType.MULTISELECT;
  readonly fieldType = FieldType.STRING;
  readonly ignore = false;
  readonly typeOf = TypeOfFeatureAttribute.STRING;
}
