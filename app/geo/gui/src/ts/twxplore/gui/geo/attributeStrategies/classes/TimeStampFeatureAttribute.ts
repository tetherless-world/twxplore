import {MapFeatureAttributeState} from "../../states/map/MapFeatureAttributeState/MapFeatureAttributeState";
import {setInitialFiltersNumeric} from "../functions/setInitialFilters/setInitialFiltersNumeric";
import {FeatureAttribute} from "./FeatureAttribute";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {KeplerFilterType} from "../../states/map/KeplerFilterType";
import {KeplerFieldType} from "../../states/map/KeplerFieldType";
import {TypeOfFeatureAttribute} from "../../states/map/TypeOfFeatureAttribute";
import {Dispatch} from "redux";
import {buildInitialFeatureAttributeStateNumeric} from "../functions/buildInitialFeatureAtttributeState/buildInitialFeatureAttributeStateNumeric";
import {updateNumericAttributeStateOfFeatureType} from "../functions/updateAttributeStateOfFeatureType/updateNumericAttributeStateOfFeatureType";
import {MapFeature} from "../../states/map/MapFeature";

export class TimestampFeatureAttribute implements FeatureAttribute {
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
  readonly name = FeatureAttributeName.timestamp;
  static readonly instance = new TimestampFeatureAttribute();
  readonly KeplerFilterType = KeplerFilterType.TIMERANGE;
  readonly KeplerFieldType = KeplerFieldType.TIMESTAMP;
  readonly ignore = false;
  readonly typeOfAttribute = TypeOfFeatureAttribute.NUMBER;
}
