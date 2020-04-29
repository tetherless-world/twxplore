import {FeatureAttribute} from "./FeatureAttribute";
import {setInitialFiltersString} from "../functions/setInitialFilters/setInitialFiltersString";
import {MapFeatureAttributeState} from "../../states/map/MapFeatureAttributeState/MapFeatureAttributeState";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {KeplerFilterType} from "../../states/map/KeplerFilterType";
import {KeplerFieldType} from "../../states/map/KeplerFieldType";
import {TypeOfFeatureAttribute} from "../../states/map/TypeOfFeatureAttribute";
import {Dispatch} from "redux";
import {buildInitialFeatureAttributeStateString} from "../functions/buildInitialFeatureAtttributeState/buildInitialFeatureAtttributeStateString";
import {updateStringAttributeStateOfFeatureType} from "../functions/updateAttributeStateOfFeatureType/updateStringAttributeStateOfFeatureType";
import {MapFeature} from "../../states/map/MapFeature";

export class RegionsFeatureAttribute implements FeatureAttribute {
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
  readonly name = FeatureAttributeName.regions;
  static readonly instance = new RegionsFeatureAttribute();
  readonly KeplerFilterType = KeplerFilterType.MULTISELECT;
  readonly KeplerFieldType = KeplerFieldType.STRING;
  readonly ignore = false;
  readonly typeOf = TypeOfFeatureAttribute.STRING;
}
