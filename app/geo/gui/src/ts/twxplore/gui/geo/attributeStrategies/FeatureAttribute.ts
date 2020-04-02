// In an OOP Language -

import {FilterName} from "../states/map/FilterName";

// TypeScript

export abstract class FeatureAttribute {
  abstract get name(): string;
  abstract get isNumeric(): boolean;
  abstract get isString(): boolean;
  abstract get filterType(): FilterName;
  abstract get ignore(): boolean;
}
