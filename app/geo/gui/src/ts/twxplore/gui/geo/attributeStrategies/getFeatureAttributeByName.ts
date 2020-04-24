import {
  FeatureAttributeName,
  FeatureAttributeKey,
} from "../states/map/FeatureAttributeName";
import {TimestampFeatureAttribute} from "./TimeStampFeatureAttribute";
import {FrequencyFeatureAttribute} from "./FrequencyFeatureAttribute";
import {TransmissionPowerFeatureAttribute} from "./TransmissionPowerFeatureAttribute";
import {IgnoreFeatureAttribute} from "./IgnoreFeatureAttribute";
import {LocalityFeatureAttribute} from "./LocalityFeatureAttribute";
import {LabelFeatureAttribute} from "./LabelFeatureAttribute";
//import {RegionsFeatureAttribute} from "./RegionsFeatureAttribute";

export const getFeatureAttributeByName = (name: string) => {
  console.log(FeatureAttributeName[name as FeatureAttributeKey]);
  switch (FeatureAttributeName[name as FeatureAttributeKey]) {
    case FeatureAttributeName.timestamp: {
      return TimestampFeatureAttribute.instance;
    }
    case FeatureAttributeName.frequency: {
      return FrequencyFeatureAttribute.instance;
    }
    case FeatureAttributeName.transmissionPower: {
      return TransmissionPowerFeatureAttribute.instance;
    }
    case FeatureAttributeName.locality: {
      return LocalityFeatureAttribute.instance;
    }
    case FeatureAttributeName.label: {
      return LabelFeatureAttribute.instance;
    }
    /*
    case FeatureAttributeName.regions: {
      return RegionsFeatureAttribute.instance;
    }
    */

    default: {
      return IgnoreFeatureAttribute.instance;
    }
  }
};
