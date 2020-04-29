import {FeatureAttribute} from "./FeatureAttribute";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {KeplerFilterType} from "../../states/map/KeplerFilterType";
import {TypeOfFeatureAttribute} from "../../states/map/TypeOfFeatureAttribute";
import {KeplerFieldType} from "../../states/map/KeplerFieldType";
import {setInitialFiltersString} from "../functions/setInitialFilters/setInitialFiltersString";
import {MapFeatureAttributeState} from "../../states/map/MapFeatureAttributeState/MapFeatureAttributeState";
import {Dispatch} from "redux";
import {buildInitialFeatureAttributeStateString} from "../functions/buildInitialFeatureAtttributeState/buildInitialFeatureAtttributeStateString";
import {MapFeature} from "../../states/map/MapFeature";
import {updateStringAttributeStateOfFeatureType} from "../functions/updateAttributeStateOfFeatureType/updateStringAttributeStateOfFeatureType";

export class LocalityFeatureAttribute implements FeatureAttribute {
  static readonly instance = new LocalityFeatureAttribute();
  updateAttributeStatesOfFeatureType(
    attributeStatesOfFeatureType: {
      [featureAttributeName: string]: MapFeatureAttributeState;
    },
    addedFeature: MapFeature
  ): void {
    updateStringAttributeStateOfFeatureType(
      attributeStatesOfFeatureType,
      addedFeature,
      this.name
    );
  }
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
      this.KeplerFilterType,
      dispatch
    );
  }
  readonly name = FeatureAttributeName.locality;
  readonly KeplerFilterType = KeplerFilterType.MULTISELECT;
  readonly KeplerFieldType = KeplerFieldType.STRING;
  readonly ignore = false;
  readonly typeOf = TypeOfFeatureAttribute.STRING;
}
