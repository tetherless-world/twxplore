import {StringFeatureAttribute} from "./StringFeatureAttribute";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {KeplerFilterType} from "../../states/map/KeplerFilterType";
import {KeplerFieldType} from "../../states/map/KeplerFieldType";

export class RegionsFeatureAttribute extends StringFeatureAttribute {
  static readonly instance = new RegionsFeatureAttribute();
  readonly name = FeatureAttributeName.regions;
  readonly KeplerFilterType = KeplerFilterType.MULTISELECT;
  readonly KeplerFieldType = KeplerFieldType.STRING;
}
