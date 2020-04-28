import {FeatureAttribute} from "./FeatureAttribute";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {FilterType} from "../../states/map/FilterType";
import {TypeOfFeatureAttribute} from "../../states/map/TypeOfFeatureAttribute";
import {FieldType} from "../../states/map/FieldType";
import {setInitialFiltersString} from "../functions/setInitialFilters/setInitialFiltersString";
import {MapFeatureAttributeState} from "../../states/map/MapFeatureAttributeState/MapFeatureAttributeState";
import {Dispatch} from "redux";
import {buildInitialFeatureAttributeStateString} from "../functions/buildInitialFeatureAtttributeState/buildInitialFeatureAtttributeStateString";

export class LocalityFeatureAttribute implements FeatureAttribute {
  static readonly instance = new LocalityFeatureAttribute();
  buildInitialFeatureAttributeState(attributeStatesOfFeatureType: {
    [featureAttributeName: string]: MapFeatureAttributeState;
  }): void {
    buildInitialFeatureAttributeStateString(
      attributeStatesOfFeatureType,
      this.name
    );
  }
  setInitialFilters(
    filterIndexOfAttribute: number,
    stateOfAttribute: MapFeatureAttributeState,
    dispatch: Dispatch<any>
  ): void {
    setInitialFiltersString(
      filterIndexOfAttribute,
      this.name,
      stateOfAttribute,
      this.filterType,
      dispatch
    );
  }
  readonly name = FeatureAttributeName.locality;
  readonly filterType = FilterType.MULTISELECT;
  readonly fieldType = FieldType.STRING;
  readonly ignore = false;
  readonly typeOf = TypeOfFeatureAttribute.STRING;
}
