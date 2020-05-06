import {
  FeatureAttributeName,
  FeatureAttributeKey,
} from "../../states/map/FeatureAttributeName";
import {FrequencyFeatureAttribute} from "../classes/FrequencyFeatureAttributeStrategy";
import {TransmissionPowerFeatureAttribute} from "../classes/TransmissionPowerFeatureAttributeStrategy";

import {LabelFeatureAttribute} from "../classes/LabelFeatureAttributeStrategy";
import {LocalityFeatureAttribute} from "../classes/LocalityFeatureAttributeStrategy";
import {IgnoreFeatureAttribute} from "../classes/IgnoreFeatureAttributeStrategy";
import {TimestampFeatureAttribute} from "../classes/TimestampFeatureAttributeStrategy";
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
