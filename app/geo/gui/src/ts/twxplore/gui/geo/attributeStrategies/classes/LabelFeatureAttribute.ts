import {FeatureAttributeName} from "../../states/map/FeatureAttributeName";
import {KeplerFilterType} from "../../states/map/KeplerFilterType";
import {KeplerFieldType} from "../../states/map/KeplerFieldType";
import {StringFeatureAttribute} from "./StringFeatureAttribute";

export class LabelFeatureAttribute extends StringFeatureAttribute {
  static readonly instance = new LabelFeatureAttribute();
  readonly name = FeatureAttributeName.label;
  readonly KeplerFilterType = KeplerFilterType.MULTISELECT;
  readonly KeplerFieldType = KeplerFieldType.STRING;
}
