import {MapFeatureAttributeState} from "../../states/map/MapFeatureAttributeState/MapFeatureAttributeState";
import {useDispatch} from "react-redux";
import {setFilter} from "kepler.gl/actions";
import {getFeatureAttributeByName} from "./getFeatureAttributeByName";
import {MapNumericFeatureAttributeState} from "../../states/map/MapFeatureAttributeState/MapNumericFeatureAttributeState";

const dispatch = useDispatch();
export const setInitialFiltersNumeric = (
  filterIndexOfAttribute: number,
  attributeName: string,
  stateOfAttribute: MapFeatureAttributeState
): void => {
  dispatch(setFilter(filterIndexOfAttribute, "name", attributeName));
  dispatch(
    setFilter(
      filterIndexOfAttribute,
      "fieldType",
      getFeatureAttributeByName(attributeName).fieldType
    )
  );
  dispatch(
    setFilter(
      filterIndexOfAttribute,
      "type",
      getFeatureAttributeByName(attributeName).filterType
    )
  );
  stateOfAttribute = stateOfAttribute as MapNumericFeatureAttributeState;
  dispatch(
    setFilter(filterIndexOfAttribute, "value", [
      stateOfAttribute.min,
      stateOfAttribute.max,
    ])
  );
  return;

  //Do nothing, we don't populate the filter until the user makes a selection
  /*
    case TypeOfFeatureAttribute.STRING: {
      stateOfAttribute = stateOfAttribute as MapStringFeatureAttributeState;

      break;
    }
    default: {
      throw Error("Unhandled case for typeOf FeatureAttribute");
    }
    */
};
