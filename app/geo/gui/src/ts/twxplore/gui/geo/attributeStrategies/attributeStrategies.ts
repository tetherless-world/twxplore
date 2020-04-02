// In an OOP Language -

import {
  FeatureAttributeName,
  FeatureAttributeKey,
} from "../states/map/FeatureAttributeName";
import {FilterNames} from "../states/map/FilterNames";

// TypeScript

export abstract class FeatureAttribute {
  constructor() {}

  static valueOf(name: string): FeatureAttribute {
    console.log(FeatureAttributeName[name as FeatureAttributeKey]);
    switch (FeatureAttributeName[name as FeatureAttributeKey]) {
      case FeatureAttributeName.timestamp: {
        return TimestampFeatureAttribute.getInstance();
      }
      case FeatureAttributeName.frequency: {
        return FrequencyFeatureAttribute.getInstance();
      }
      case FeatureAttributeName.transmissionPower: {
        return TransmissionPowerFeatureAttribute.getInstance();
      }

      default: {
        return IgnoreFeatureAttribute.getInstance();
      }
    }
  }
  abstract get name(): string;
  abstract get isNumeric(): boolean;
  abstract get isString(): boolean;
  abstract get filterType(): FilterNames;
  get ignore(): boolean {
    return false;
  }
}

class TimestampFeatureAttribute extends FeatureAttribute {
  static readonly instance: TimestampFeatureAttribute = new TimestampFeatureAttribute();
  private constructor() {
    super();
  }

  public static getInstance(): TimestampFeatureAttribute {
    return TimestampFeatureAttribute.instance;
  }

  get name(): string {
    return FeatureAttributeName.timestamp;
  }
  get isNumeric() {
    return true;
  }
  get isString() {
    return false;
  }
  get filterType() {
    return FilterNames.TIMERANGE;
  }
}

class FrequencyFeatureAttribute extends FeatureAttribute {
  static readonly instance: FrequencyFeatureAttribute = new FrequencyFeatureAttribute();

  private constructor() {
    super();
  }

  public static getInstance(): TimestampFeatureAttribute {
    return FrequencyFeatureAttribute.instance;
  }
  get name() {
    return FeatureAttributeName.frequency;
  }
  get isNumeric() {
    return true;
  }
  get isString() {
    return false;
  }

  get filterType() {
    return FilterNames.RANGE;
  }
}

class TransmissionPowerFeatureAttribute extends FeatureAttribute {
  public static readonly instance: TransmissionPowerFeatureAttribute = new TransmissionPowerFeatureAttribute();

  private constructor() {
    super();
  }

  public static getInstance(): TimestampFeatureAttribute {
    return TransmissionPowerFeatureAttribute.instance;
  }

  get name() {
    return FeatureAttributeName.transmissionPower;
  }
  get isNumeric() {
    return true;
  }
  get isString() {
    return false;
  }
  get filterType() {
    return FilterNames.RANGE;
  }
}

class IgnoreFeatureAttribute extends FeatureAttribute {
  public static readonly instance: IgnoreFeatureAttribute = new IgnoreFeatureAttribute();

  private constructor() {
    super();
  }

  public static getInstance(): TimestampFeatureAttribute {
    return IgnoreFeatureAttribute.instance;
  }
  get name() {
    return "ignore";
  }
  get isNumeric() {
    return false;
  }
  get isString() {
    return false;
  }

  get filterType() {
    return FilterNames.RANGE;
  }

  get ignore() {
    return true;
  }
}
