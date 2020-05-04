import {
  FeatureAttributeName,
  FeatureAttributeKey,
} from "../../states/map/FeatureAttributeName";
import {FrequencyFeatureAttribute} from "../classes/FrequencyFeatureAttribute";
import {TransmissionPowerFeatureAttribute} from "../classes/TransmissionPowerFeatureAttribute";

import {LabelFeatureAttribute} from "../classes/LabelFeatureAttribute";
import {LocalityFeatureAttribute} from "../classes/LocalityFeatureAttribute";
import {IgnoreFeatureAttribute} from "../classes/IgnoreFeatureAttribute";
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
