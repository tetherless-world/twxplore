import {FeatureTypeStrategy} from "./FeatureTypeStrategy";
import {FeatureType, FeatureQuery} from "../api/graphqlGlobalTypes";

export class RootFeatureTypeStrategy implements FeatureTypeStrategy {
  getQuery(clickedFeatureUri: string): FeatureQuery {
    return {
      onlyFeatureUri:
        "http://twxplore.github.io/app/geo/feature#tiger_line-tl_2019_us_state-38",
    };
  }
  readonly name = FeatureType.Root;
  readonly childFeatureTypes = [FeatureType.State];
  static readonly instance = new RootFeatureTypeStrategy();
  expandable = true;
}
