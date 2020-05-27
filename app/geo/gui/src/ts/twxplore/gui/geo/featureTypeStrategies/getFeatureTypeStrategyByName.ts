import {FeatureType} from "../api/graphqlGlobalTypes";
import {CountyFeatureTypeStrategy} from "./PolygonFeatureTypeStrategy/CountyFeatureTypeStrategy";
import {StateFeatureTypeStrategy} from "./PolygonFeatureTypeStrategy/StateFeatureTypeStrategy";
import {MetropolitanDivisionFeatureTypeStrategy} from "./PolygonFeatureTypeStrategy/MetropolitanDivisionFeatureType";
import {MilitaryInstallationFeatureTypeStrategy} from "./PolygonFeatureTypeStrategy/MilitaryInstallationFeatureTypeStrategy";
import {TransmissionFeatureTypeStrategy} from "./PointFeatureTypeStrategy/TransmissionFeatureTypeStrategy";
import {TransmitterFeatureTypeStrategy} from "./PointFeatureTypeStrategy/TransmitterFeatureTypeStrategy";
import {RootFeatureTypeStrategy} from "./RootFeatureTypeStrategy";
import {PolicyFeatureTypeStrategy} from "./PointFeatureTypeStrategy/PolicyFeatureTypeStrategy";

//type FeatureTypeKey = keyof typeof FeatureType;

export const getFeatureTypeStrategyByName = (featureTypeName: FeatureType) => {
  switch (featureTypeName) {
    case FeatureType.State: {
      return StateFeatureTypeStrategy.instance;
    }
    case FeatureType.County: {
      return CountyFeatureTypeStrategy.instance;
    }
    case FeatureType.MetropolitanDivision: {
      return MetropolitanDivisionFeatureTypeStrategy.instance;
    }
    case FeatureType.MilitaryInstallation: {
      return MilitaryInstallationFeatureTypeStrategy.instance;
    }
    case FeatureType.Transmission: {
      return TransmissionFeatureTypeStrategy.instance;
    }
    case FeatureType.Transmitter: {
      return TransmitterFeatureTypeStrategy.instance;
    }
    case FeatureType.Root: {
      return RootFeatureTypeStrategy.instance;
    }
    case FeatureType.Policy: {
      return PolicyFeatureTypeStrategy.instance;
    }

    default: {
      throw Error("Unrecognized Feature Type of type " + featureTypeName);
    }
  }
};
