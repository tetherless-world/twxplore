import * as React from "react";
import {makeStyles, Theme, createStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import {connect, useSelector, useDispatch} from "react-redux";
import {MapState} from "../../states/map/MapState";
import {RootState} from "../../states/root/RootState";
import {setFilter} from "kepler.gl/actions";
import {getFeatureAttributeStrategyByName} from "../../attributeStrategies/functions/getFeatureAttributeStrategyByName";
import {MapFeatureTypeState} from "../../states/map/MapFeatureTypeState";
import {allFiltersSet} from "../../actions/map/AllFiltersSetAction";
import {FeatureType} from "../../api/graphqlGlobalTypes";
import {TypeOfFeatureAttribute} from "../../states/map/TypeOfFeatureAttribute";
import {MapNumericFeatureAttributeState} from "../../states/map/MapFeatureAttributeState/MapNumericFeatureAttributeState";
import {MapStringFeatureAttributeState} from "../../states/map/MapFeatureAttributeState/MapStringFeatureAttributeState";
import {FormControl, TextField, Grid, Chip} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {MapFeatureAttributeState} from "../../states/map/MapFeatureAttributeState/MapFeatureAttributeState";
import {attributeCurrentValueChange} from "../../actions/map/AttributeCurrentValueChange";

const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 220,
    },
    margin: {
      height: theme.spacing(1),
    },
    formControl: {
      width: 180,
    },
    autoComplete: {
      margin: theme.spacing(0),
      float: "left",
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
    drawerGridContainer: {
      width: drawerWidth,
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

  const returnFilterComponent = (kwds: {
    filterIndexOfAttribute: number | null;
    attributeName: string;
    attributeStateOfAttributeOfFeatureType: MapFeatureAttributeState;
  }) => {
    const {
      filterIndexOfAttribute,
      attributeName,
      attributeStateOfAttributeOfFeatureType,
    } = kwds;
    switch (getFeatureAttributeStrategyByName(attributeName).typeOfAttribute) {
      case TypeOfFeatureAttribute.NUMBER: {
        const numericAttributeState = attributeStateOfAttributeOfFeatureType as MapNumericFeatureAttributeState;
        if (numericAttributeState.fullRange === undefined) {
          return <React.Fragment />;
        }
        return (
          numericAttributeState.fullRange && (
            <Grid item key={attributeName}>
              <Typography id="type" gutterBottom>
                {attributeName}
              </Typography>
              <Slider
                style={{width: drawerWidth - 80}}
                defaultValue={[
                  numericAttributeState.fullRange!.min,
                  numericAttributeState.fullRange!.max,
                ]}
                getAriaValueText={valuetext}
                aria-labelledby="range-slider"
                step={1}
                min={numericAttributeState.fullRange!.min}
                max={numericAttributeState.fullRange!.max}
                valueLabelDisplay="auto"
                disabled={!numericAttributeState.fullRange!.max}
                onChangeCommitted={(event: any, newValue: number | number[]) =>
                  handleChangeSlider(
                    event,
                    newValue,
                    filterIndexOfAttribute!,
                    featureType,
                    attributeName
                  )
                }
                name={attributeName}
              />
            </Grid>
          )
        );
      }
      case TypeOfFeatureAttribute.STRING: {
        let stringAttributeState = attributeStateOfAttributeOfFeatureType as MapStringFeatureAttributeState;
        if (
          !stringAttributeState.values ||
          stringAttributeState.values.length === 0
        ) {
          return <React.Fragment />;
        }
        return (
          <Grid item key={attributeName}>
            <FormControl className={classes.formControl} key={attributeName}>
              <Typography id="type" gutterBottom>
                {attributeName}
              </Typography>
              <Autocomplete
                className={classes.drawerGridContainer}
                style={{width: drawerWidth - 80}}
                multiple
                id="tags-outlined"
                options={stringAttributeState.values!}
                getOptionLabel={option => option}
                filterSelectedOptions
                onChange={(event: any, value: string | string[]) => {
                  handleChangeSelect(event, value, filterIndexOfAttribute!);
                }}
                renderInput={params => (
                  <TextField {...params} variant="outlined" />
                )}
              />
            </FormControl>
          </Grid>
        );
      }
      default: {
        throw Error("Unhandled case for typeOf FeatureAttribute");
      }
    }
  };

  const returnChipComponent = (
    featureTypeState: MapFeatureTypeState,
    attributeStateOfAttributeOfFeatureType: MapNumericFeatureAttributeState,
    attributeName: string
  ) => {
    const featureAttributeStrategy = getFeatureAttributeStrategyByName(
      attributeName
    );
    if (featureTypeState === MapFeatureTypeState.FINISHED_SETUP) {
      if (
        getFeatureAttributeStrategyByName(attributeName).typeOfAttribute ===
          TypeOfFeatureAttribute.NUMBER &&
        attributeStateOfAttributeOfFeatureType.currentRange
      ) {
        const numericAttributeState = attributeStateOfAttributeOfFeatureType as MapNumericFeatureAttributeState;
        const chipLabelForAttribute = featureAttributeStrategy.getAttributeChipLabel(
          numericAttributeState.currentRange!
        );
        return (
          <Grid item>
            <Chip
              style={{width: drawerWidth - 80}}
              label={chipLabelForAttribute}
            />{" "}
          </Grid>
        );
      } else {
        return <React.Fragment />;
      }
    } else {
      return <React.Fragment />;
    }
  };

  const handleChangeSlider = (
    event: any,
    newValue: number | number[],
    filterIndexOfAttribute: number,
    featureType: string,
    attributeName: string
  ) => {
    dispatch(setFilter(filterIndexOfAttribute, "value", newValue));
    dispatch(attributeCurrentValueChange(featureType, attributeName, newValue));
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
    <React.Fragment>
      {//for each attributeName that corresponds to an attribute state for an attribute of the FeatureType
      Object.keys(attributeStatesOfFeatureType).map(attributeName => {
        //Specify the attribute state to use by passing in the name of the attribute of the FeatureType
        const attributeStateOfAttributeOfFeatureType =
          attributeStatesOfFeatureType[attributeName]; //e.g. timestamp:{min,max}, frequency:{min, max}
        const filterIndexOfAttribute =
          attributeStateOfAttributeOfFeatureType.filterIndex;
        switch (featureTypeState) {
          //If filters have been added
          case MapFeatureTypeState.NEEDS_INITIAL_FILTER_SETTING: {
            //if filters have not been set yet. Attach the slider to a filter based on the attribute's unique id
            const featureAttributeStrategy = getFeatureAttributeStrategyByName(
              attributeName
            );
            featureAttributeStrategy.setInitialFilters(
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
            return <React.Fragment key={attributeName} />;
          }
          //If filters have been initialized and all work done for setting up a feature type has completed.
          case MapFeatureTypeState.FINISHED_SETUP: {
            return returnFilterComponent({
              filterIndexOfAttribute,
              attributeName,
              attributeStateOfAttributeOfFeatureType,
            });
          }
          //This handles the case in which the featureTypeState is ABSENT_ON_MAP or WAITING_ON_LOAD
          default: {
            return <React.Fragment key={attributeName} />;
          }
        }
      })}
      {Object.keys(attributeStatesOfFeatureType).map(attributeName => {
        //Specify the attribute state to use by passing in the name of the attribute of the FeatureType
        const attributeStateOfAttributeOfFeatureType =
          attributeStatesOfFeatureType[attributeName];
        return returnChipComponent(
          featureTypeState,
          attributeStateOfAttributeOfFeatureType,
          attributeName
        );
      })}
    </React.Fragment>
  );
};
export const FilterComponent = connect()(FilterComponentImpl);
