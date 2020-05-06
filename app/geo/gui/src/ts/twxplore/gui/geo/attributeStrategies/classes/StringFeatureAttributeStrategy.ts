import {FeatureAttribute} from "./FeatureAttribute";
import {MapFeatureAttributeState} from "../../states/map/MapFeatureAttributeState/MapFeatureAttributeState";
import {MapFeature} from "../../states/map/MapFeature";
import {Dispatch} from "redux";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {TypeOfFeatureAttribute} from "../../states/map/TypeOfFeatureAttribute";
import {KeplerFilterType} from "../../states/map/KeplerFilterType";
import {MapStringFeatureAttributeState} from "../../states/map/MapFeatureAttributeState/MapStringFeatureAttributeState";
import {setFilter} from "kepler.gl/actions";

export abstract class StringFeatureAttributeStrategy
  implements FeatureAttribute {
  buildInitialFeatureAttributeState(
    attributeStatesOfFeatureType: {
      [featureAttributeName: string]: MapFeatureAttributeState;
    },
    filterIndexCounter: number
  ): void {
    let attributeName = this.name;
    attributeStatesOfFeatureType[attributeName] = {
      filterIndex: filterIndexCounter,
    };
  }
  updateAttributeStatesOfFeatureType(
    attributeStatesOfFeatureType: {
      [featureAttributeName: string]: MapFeatureAttributeState;
    },
    addedFeature: MapFeature
  ): void {
    const attributeName = this.name;
    const attributeKey = this.name as keyof MapFeature;
    //Specifying the attribute state of the addedFeature's FeatureType to be updated (e.g. the state of 'frequency' of Transmissions)

    let attributeStateOfAttributeOfFeatureType = attributeStatesOfFeatureType[
      attributeName
    ] as MapStringFeatureAttributeState;
    //If this is the first time coming across this attribute for the addedFeature's FeatureType
    if (!attributeStateOfAttributeOfFeatureType.values) {
      //Give the attribute a default MapStringFeatureAttributeState
      attributeStateOfAttributeOfFeatureType.values = [];
    }
    //add the value of addedFeature's attribute into the values list of the attribute state if the value is not null and is not already included.
    if (
      addedFeature[attributeKey] !== null &&
      !attributeStateOfAttributeOfFeatureType.values.includes(
        addedFeature[attributeKey] as string
      )
    )
      attributeStateOfAttributeOfFeatureType.values.push(
        addedFeature[attributeKey] as string
      );

    return;
  }

  setInitialFilters(
    filterIndexOfAttribute: number,
    stateOfAttribute: MapFeatureAttributeState,
    dispatch: Dispatch<any>
  ): void {
    const attributeName = this.name;
    stateOfAttribute = stateOfAttribute as MapStringFeatureAttributeState;
    dispatch(setFilter(filterIndexOfAttribute, "name", attributeName));
    dispatch(setFilter(filterIndexOfAttribute, "type", this.keplerFilterType));
    dispatch(setFilter(filterIndexOfAttribute, "enlarged", false)); //disables any pop-up Kepler may bring up with the filter

    return;
  }
  abstract readonly name: FeatureAttributeName;
  readonly typeOfAttribute = TypeOfFeatureAttribute.STRING;
  abstract readonly keplerFilterType: KeplerFilterType;
  readonly ignore = false;
}
