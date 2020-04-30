import {StringFeatureAttribute} from "./StringFeatureAttribute";
import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {KeplerFilterType} from "../../states/map/KeplerFilterType";
import {KeplerFieldType} from "../../states/map/KeplerFieldType";

export class LocalityFeatureAttribute extends StringFeatureAttribute {
  static readonly instance = new LocalityFeatureAttribute();
  readonly name = FeatureAttributeName.locality;
  readonly KeplerFilterType = KeplerFilterType.MULTISELECT;
  readonly KeplerFieldType = KeplerFieldType.STRING;
}
