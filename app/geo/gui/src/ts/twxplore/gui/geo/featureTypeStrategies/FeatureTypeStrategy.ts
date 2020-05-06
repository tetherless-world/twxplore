export interface FeatureTypeStrategy {
  readonly name: string;
  readonly withinFeatureTypes: string[];
  readonly expandable: boolean;
}
