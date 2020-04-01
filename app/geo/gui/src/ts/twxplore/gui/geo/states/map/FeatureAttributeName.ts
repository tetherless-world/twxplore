export enum FeatureAttributeName {
    label = "label",
    type = "type",
    uri = "uri",
    frequency = "frequency",
    timestamp = "timestamp",
    locality = "locality",
    postalcode = "postalcode",
    regions =  "regions",
    transmissionPower = "transmissionPower",
    geometry = "geometry",
}

export type AttributeKey = keyof typeof FeatureAttributeName