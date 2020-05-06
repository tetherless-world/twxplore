//import {RegionsFeatureAttribute} from "./RegionsFeatureAttribute";

import {
  FeatureAttributeName,
  FeatureAttributeKey,
} from "../../states/map/FeatureAttributeName";
import {TimestampFeatureAttributeStrategy} from "../classes/NumericFeatureAttributeStrategy/TimestampFeatureAttributeStrategy";
import {FrequencyFeatureAttributeStrategy} from "../classes/NumericFeatureAttributeStrategy/FrequencyFeatureAttributeStrategy";
import {TransmissionPowerFeatureAttributeStrategy} from "../classes/NumericFeatureAttributeStrategy/TransmissionPowerFeatureAttributeStrategy";
import {LocalityFeatureAttributeStrategy} from "../classes/StringFeatureAttributeStrategy/LocalityFeatureAttributeStrategy";
import {LabelFeatureAttributeStrategy} from "../classes/StringFeatureAttributeStrategy/LabelFeatureAttributeStrategy";
import {IgnoreFeatureAttributeStrategy} from "../classes/IgnoreFeatureAttributeStrategy";

export const getFeatureAttributeStrategyByName = (name: string) => {
  console.log(FeatureAttributeName[name as FeatureAttributeKey]);
  switch (FeatureAttributeName[name as FeatureAttributeKey]) {
    case FeatureAttributeName.timestamp: {
      return TimestampFeatureAttributeStrategy.instance;
    }
    case FeatureAttributeName.frequency: {
      return FrequencyFeatureAttributeStrategy.instance;
    }
    case FeatureAttributeName.transmissionPower: {
      return TransmissionPowerFeatureAttributeStrategy.instance;
    }
    case FeatureAttributeName.locality: {
      return LocalityFeatureAttributeStrategy.instance;
    }
    case FeatureAttributeName.label: {
      return LabelFeatureAttributeStrategy.instance;
    }
    /*
    case FeatureAttributeName.regions: {
      return RegionsFeatureAttribute.instance;
    }
    */

    default: {
      return IgnoreFeatureAttributeStrategy.instance;
    }
  }
};
