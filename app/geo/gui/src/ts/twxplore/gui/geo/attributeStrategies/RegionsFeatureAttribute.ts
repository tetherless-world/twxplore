import {FeatureAttribute} from "./FeatureAttribute";
import {FeatureAttributeName} from "../states/map/FeatureAttributeName";
import {FilterType} from "../states/map/FilterType";

export class RegionsFeatureAttribute implements FeatureAttribute {
  static readonly instance = new RegionsFeatureAttribute();

  readonly isNumeric = false;
  readonly name = FeatureAttributeName.regions;
  readonly isString = true;
  readonly filterType = FilterType.MULTISELECT;
  readonly ignore = false;
}
