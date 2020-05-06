import * as React from "react";
import {makeStyles, Theme, createStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import {connect, useSelector, useDispatch} from "react-redux";
import {MapState} from "../../states/map/MapState";
import {RootState} from "../../states/root/RootState";
import {setFilter} from "kepler.gl/actions";
import {getFeatureAttributeByName} from "../../attributeStrategies/functions/getFeatureAttributeByName";
import {MapFeatureTypeState} from "../../states/map/MapFeatureTypeState";
import {allFiltersSet} from "../../actions/map/AllFiltersSetAction";
import {FeatureType} from "../../api/graphqlGlobalTypes";
import {MapFeatureAttributeState} from "../../states/map/MapFeatureAttributeState/MapFeatureAttributeState";
import {TypeOfFeatureAttribute} from "../../states/map/TypeOfFeatureAttribute";
import {MapNumericFeatureAttributeState} from "../../states/map/MapFeatureAttributeState/MapNumericFeatureAttributeState";
import {MapStringFeatureAttributeState} from "../../states/map/MapFeatureAttributeState/MapStringFeatureAttributeState";
import {FormControl, TextField} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 300,
    },
    margin: {
      height: theme.spacing(3),
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      maxWidth: 300,
    },
    chips: {
      display: "flex",
      flexWrap: "wrap",
    },
    chip: {
      margin: 2,
    },
    noLabel: {
      marginTop: theme.spacing(3),
    },
  })
);

function valuetext(value: number) {
  return `${value}`;
}

//var filterIndexOfAttribute: number | null; //necessary to pass this into onChangeCommitted since it
const FilterComponentImpl: React.FunctionComponent<{featureType: string}> = ({
  featureType,
}) => {
  const classes = useStyles();
  const state: MapState = useSelector(
    (rootState: RootState) => rootState.app.map
  );

  const returnFilterComponent = (
    filterIndexOfAttribute: number,
    attributeName: string,
    stateOfAttribute: MapNumericFeatureAttributeState
  ) => {
    switch (getFeatureAttributeByName(attributeName).typeOfAttribute) {
      case TypeOfFeatureAttribute.NUMBER: {
        stateOfAttribute = stateOfAttribute as MapNumericFeatureAttributeState;
        return (
          <div key={attributeName}>
            <Typography id="type" gutterBottom>
              {attributeName}
            </Typography>
            <Slider
              defaultValue={[
                stateOfAttribute.range!.min,
                stateOfAttribute.range!.max,
              ]}
              getAriaValueText={valuetext}
              aria-labelledby="range-slider"
              step={1}
              min={stateOfAttribute.range!.min}
              max={stateOfAttribute.range!.max}
              valueLabelDisplay="auto"
              disabled={!stateOfAttribute.range!.max}
              onChangeCommitted={(event: any, newValue: number | number[]) =>
                handleChangeSlider(event, newValue, filterIndexOfAttribute!)
              }
              name={attributeName}
            />
          </div>
        );
      }
      case TypeOfFeatureAttribute.STRING: {
        stateOfAttribute = stateOfAttribute as MapStringFeatureAttributeState;
        return (
          <FormControl className={classes.formControl}>
            <Typography id="type" gutterBottom>
              {attributeName}
            </Typography>
            <Autocomplete
              multiple
              id="tags-outlined"
              options={stateOfAttribute.values}
              getOptionLabel={option => option}
              filterSelectedOptions
              onChange={(event: any, value: string | string[]) => {
                handleChangeSelect(event, value, filterIndexOfAttribute);
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="filterSelectedOptions"
                  placeholder="Favorites"
                />
              )}
            />
          </FormControl>
        );
      }
      default: {
        throw Error("Unhandled case for typeOf FeatureAttribute");
      }
    }
  };

  const handleChangeSlider = (
    event: any,
    newValue: number | number[],
    filterIndexOfAttribute: number
  ) => {
    dispatch(setFilter(filterIndexOfAttribute, "value", newValue));
  };
  const handleChangeSelect = (
    event: React.ChangeEvent<{value: unknown}>,
    newValue: string | string[],
    filterIndexOfAttribute: number
  ) => {
    dispatch(setFilter(filterIndexOfAttribute, "value", newValue));
  };

  //Get the featureTypeState of the appropriate featureType which was passed in by FilterPanel as a prop
  const featureTypeState = state.featuresByType[featureType].featureTypeState;

  //attributeStatesOfFeatureType is now an object, with each of its properties being the state of
  //an attribute of that FeatureType.
  //i.e. attributeStatesOfFeature = {frequency: {min:0, max:100, filterIndex: 0}, tranmsmissionPower: {min:0, max:20, filterIndex: 1}}
  const attributeStatesOfFeatureType =
    state.featuresByType[featureType].attributeStates;

  const dispatch = useDispatch();

  return (
    <div className={classes.root}>
      <div className={classes.margin} />
      {//for each attributeName that corresponds to an attribute state for an attribute of the FeatureType
      Object.keys(attributeStatesOfFeatureType).map(attributeName => {
        //Specify the attribute state to use by passing in the name of the attribute of the FeatureType
        const attributeStateOfAttributeOfFeatureType =
          attributeStatesOfFeatureType[attributeName]; //e.g. timestamp:{min,max}, frequency:{min, max}
        const filterIndexOfAttribute =
          attributeStateOfAttributeOfFeatureType.filterIndex;
        switch (featureTypeState) {
          //If filters have been added
          case MapFeatureTypeState.FILTERS_ADDED: {
            //if filters have not been set yet. Attach the slider to a filter based on the attribute's unique id
            const featureAttribute = getFeatureAttributeByName(attributeName);
            featureAttribute.setInitialFilters(
              filterIndexOfAttribute!,
              attributeStateOfAttributeOfFeatureType,
              dispatch
            );
            //All filters set, dispatch an action to change the state of the FeatureType to reflect that.
            dispatch(
              allFiltersSet(
                FeatureType[featureType as keyof typeof FeatureType]
              )
            );
            return <React.Fragment />;
          }
          //If filters have been set
          case MapFeatureTypeState.FILTERS_SET: {
            return returnFilterComponent(
              filterIndexOfAttribute!,
              attributeName,
              attributeStateOfAttributeOfFeatureType
            );
          }
          //This handles the case in which the featureTypeState is ABSENT_ON_MAP or WAITING_ON_LOAD
          default: {
            return <React.Fragment />;
          }
        }
      })}
    </div>
  );
};
export const FilterComponent = connect()(FilterComponentImpl);
