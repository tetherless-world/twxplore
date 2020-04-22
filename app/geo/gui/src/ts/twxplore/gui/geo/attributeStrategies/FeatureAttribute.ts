// In an OOP Language -

import {FilterType} from "../states/map/FilterType";
import {TypeOfFeatureAttribute} from "../states/map/TypeOfFeatureAttribute";

// TypeScript

export interface FeatureAttribute {
  readonly name: string;
  readonly typeOf: TypeOfFeatureAttribute;
  readonly filterType: FilterType;
  readonly ignore: boolean;
}
