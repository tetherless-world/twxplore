// In an OOP Language -

import {FilterType} from "../states/map/FilterType";

// TypeScript

export interface FeatureAttribute {
  readonly name: string;
  readonly isNumeric: boolean;
  readonly isString: boolean;
  readonly filterType: FilterType;
  readonly ignore: boolean;
}
