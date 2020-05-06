import {FeatureType} from "../api/graphqlGlobalTypes";
import {CountyFeatureTypeStrategy} from "./PolygonFeatureTypeStrategy/CountyFeatureTypeStrategy";
import {StateFeatureTypeStrategy} from "./PolygonFeatureTypeStrategy/StateFeatureTypeStrategy";
import {MetropolitanDivisionFeatureTypeStrategy} from "./PolygonFeatureTypeStrategy/MetropolitanDivisionFeatureType";
import {MilitaryInstallationFeatureTypeStrategy} from "./PolygonFeatureTypeStrategy/MilitaryInstallationFeatureTypeStrategy";
import {TransmissionFeatureTypeStrategy} from "./PointFeatureType/TransmissionFeatureTypeStrategy";
import {TransmitterFeatureTypeStrategy} from "./PointFeatureType/TransmitterFeatureTypeStrategy";

//type FeatureTypeKey = keyof typeof FeatureType;

export const getFeatureTypeByName = (featureTypeName: FeatureType) => {
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

    default: {
      throw Error("Unrecognized Feature Type");
    }
  }
};
