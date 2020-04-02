import {FilterName} from "../states/map/FilterName";
import {FeatureAttributeName} from "../states/map/FeatureAttributeName";
import {FeatureAttribute} from "./FeatureAttribute";

export class TransmissionPowerFeatureAttribute extends FeatureAttribute {
  public static readonly instance: TransmissionPowerFeatureAttribute = new TransmissionPowerFeatureAttribute();

  readonly isNumeric = true;
  readonly name = FeatureAttributeName.transmissionPower;
  readonly isString = false;
  readonly filterType = FilterName.RANGE;
  readonly ignore = true;
}
