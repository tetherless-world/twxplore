import {MapFeatureAttributeState} from "../../states/map/MapFeatureAttributeState/MapFeatureAttributeState";
import {setInitialFiltersNumeric} from "../functions/setInitialFilters/setInitialFiltersNumeric";
import {FeatureAttribute} from "./FeatureAttribute";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {FilterType} from "../../states/map/FilterType";
import {FieldType} from "../../states/map/FieldType";
import {TypeOfFeatureAttribute} from "../../states/map/TypeOfFeatureAttribute";
import {Dispatch} from "redux";
import {buildInitialFeatureAttributeStateNumeric} from "../functions/buildInitialFeatureAtttributeState/buildInitialFeatureAttributeStateNumeric";

export class TimestampFeatureAttribute implements FeatureAttribute {
  static readonly instance = new TimestampFeatureAttribute();
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
  readonly name = FeatureAttributeName.timestamp;
  readonly filterType = FilterType.TIMERANGE;
  readonly fieldType = FieldType.TIMESTAMP;
  readonly ignore = false;
  readonly typeOf = TypeOfFeatureAttribute.NUMBER;
}
