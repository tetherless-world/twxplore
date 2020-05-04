import {FeatureAttribute} from "./FeatureAttribute";
import {MapFeatureAttributeState} from "../../states/map/MapFeatureAttributeState/MapFeatureAttributeState";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {TypeOfFeatureAttribute} from "../../states/map/TypeOfFeatureAttribute";
import {KeplerFilterType} from "../../states/map/KeplerFilterType";
import {Dispatch} from "redux";
import {MapFeature} from "../../states/map/MapFeature";
import {MapNumericFeatureAttributeState} from "../../states/map/MapFeatureAttributeState/MapNumericFeatureAttributeState";
import {setFilter} from "kepler.gl/actions";

export abstract class NumericFeatureAttribute implements FeatureAttribute {
  updateAttributeStatesOfFeatureType(
    attributeStatesOfFeatureType: {
      [featureAttributeName: string]: MapFeatureAttributeState;
    },
    addedFeature: MapFeature
  ): void {
    const attributeName = this.name;
    const attributeKey = attributeName as keyof MapFeature;
    //Specifying the attribute state of the addedFeature's FeatureType to be updated (e.g. the attribute state of 'frequency' of Transmissions)
    let attributeStateOfAttributeOffFeatureType = attributeStatesOfFeatureType[
      attributeName
    ] as MapNumericFeatureAttributeState;
    //If this is the first time coming across this attribute for the addedFeature's FeatureType
    if (!attributeStateOfAttributeOffFeatureType) {
      //Give the MapNumericAttributeState min/max the addedFeature's value for the attribute
      attributeStatesOfFeatureType[attributeName] = {
        range: {
          min: addedFeature[attributeKey] as number,
          max: addedFeature[attributeKey] as number,
        },
        filterIndex: null,
      };

      return;
    }
    //If this is NOT the first time coming across this attribute for the addedFeature's FeatureType
    //Compare attribute value of addedFeature to the min found in the attribute state. Set new min if necessary.
    if (
      (addedFeature[attributeKey] as number) <
      attributeStateOfAttributeOffFeatureType.range!.min
    )
      attributeStateOfAttributeOffFeatureType.range!.min = addedFeature[
        attributeKey
      ] as number;
    //Compare attribute value to the max found in the attribute state. Set new max if necessary.
    else if (
      (addedFeature[attributeKey] as number) >
      attributeStateOfAttributeOffFeatureType.range!.max
    )
      attributeStateOfAttributeOffFeatureType.range!.max = addedFeature[
        attributeKey
      ] as number;
    return;
  }

  setInitialFilters(
    filterIndexOfAttribute: number,
    stateOfAttribute: MapFeatureAttributeState,
    dispatch: Dispatch<any>
  ): void {
    const attributeName = this.name;
    dispatch(setFilter(filterIndexOfAttribute, "name", attributeName));
    dispatch(setFilter(filterIndexOfAttribute, "type", this.keplerFilterType));
    stateOfAttribute = stateOfAttribute as MapNumericFeatureAttributeState;
    dispatch(
      setFilter(filterIndexOfAttribute, "value", [
        stateOfAttribute.range!.min,
        stateOfAttribute.range!.max,
      ])
    );
    dispatch(setFilter(filterIndexOfAttribute, "enlarged", false)); //disables any pop-up Kepler may bring up with the filter

    return;
  }
  abstract readonly name: FeatureAttributeName;
  readonly typeOfAttribute = TypeOfFeatureAttribute.NUMBER;
  abstract readonly keplerFilterType: KeplerFilterType;
  readonly ignore = false;
}
