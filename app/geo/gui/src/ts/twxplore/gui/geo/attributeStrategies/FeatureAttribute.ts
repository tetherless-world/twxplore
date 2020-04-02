// In an OOP Language -

import {FilterType} from "../states/map/FilterType";

// TypeScript

export interface FeatureAttribute {
  name: string;
  isNumeric: boolean;
  isString: boolean;
  filterType: FilterType;
  ignore: boolean;
}
