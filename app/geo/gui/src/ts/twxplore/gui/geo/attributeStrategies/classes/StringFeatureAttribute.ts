import {FeatureAttribute} from "./FeatureAttribute";
import {MapFeatureAttributeState} from "../../states/map/MapFeatureAttributeState/MapFeatureAttributeState";
import {MapFeature} from "../../states/map/MapFeature";
import {updateStringAttributeStateOfFeatureType} from "../functions/updateAttributeStateOfFeatureType/updateStringAttributeStateOfFeatureType";
import {buildInitialFeatureAttributeStateString} from "../functions/buildInitialFeatureAtttributeState/buildInitialFeatureAtttributeStateString";
import {Dispatch} from "redux";
import {setInitialFiltersString} from "../functions/setInitialFilters/setInitialFiltersString";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {TypeOfFeatureAttribute} from "../../states/map/TypeOfFeatureAttribute";
import {KeplerFilterType} from "../../states/map/KeplerFilterType";
import {KeplerFieldType} from "../../states/map/KeplerFieldType";

export abstract class StringFeatureAttribute implements FeatureAttribute {
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
  abstract readonly name: FeatureAttributeName;
  readonly typeOfAttribute = TypeOfFeatureAttribute.STRING;
  abstract readonly KeplerFilterType: KeplerFilterType;
  abstract readonly KeplerFieldType: KeplerFieldType;
  readonly ignore = false;
}
