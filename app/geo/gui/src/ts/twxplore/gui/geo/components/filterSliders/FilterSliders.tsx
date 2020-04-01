import * as React from "react";
import {makeStyles, Theme, createStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import {connect, useSelector, useDispatch} from "react-redux";
import {MapState} from "../../states/map/MapState";
import {RootState} from "../../states/root/RootState";
import {setFilter} from "kepler.gl/actions";
import { FeatureAttribute } from "../../attributeStrategies/attributeStrategies";
import { FeatureAttributeName, AttributeKey } from "../../states/map/FeatureAttributeName";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 300,
    },
    margin: {
      height: theme.spacing(3),
    },
  })
);

function valuetext(value: number) {
  return `${value}`;
}

var filtersSet = false;

const FilterSlidersImpl: React.FunctionComponent<{featureType: string}> = ({
  featureType,
}) => {
  const classes = useStyles();
  const state: MapState = useSelector(
    (rootState: RootState) => rootState.app.map
  );

  const featureTypeFilter = state.featureTypesFilters[featureType];
  const dispatch = useDispatch();
  const handleChange = (
    event: any,
    newValue: number | number[],
    attribute: string,
    idx: number
  ) => {
    dispatch(setFilter(idx, "value", newValue));
  };

  return (
    <div className={classes.root}>
      <div className={classes.margin} />
      {Object.keys(featureTypeFilter).map(attribute => {
        //attribute being an attribute of a feature e.g. timestamp, frequency
        const attributeProperties = (featureTypeFilter as any)[attribute]; //e.g. timestamp:{min,max}, frequency:{min, max}
        const idx = attributeProperties.idx;
        if (!filtersSet) {
          //if filters have not been set yet. Attach the slider to a filter based on the attribute's unique id
          dispatch(setFilter(idx, "name", attribute));
          dispatch(setFilter(idx, "type",FeatureAttribute.AttributeTypeOf(FeatureAttributeName[attribute as AttributeKey]).getFilterType()))
          dispatch(setFilter(idx, 'value',[attributeProperties.min, attributeProperties.max]))
          /*if (attribute == "frequency") {
            dispatch(setFilter(idx, "type", "range"));
            dispatch(
              setFilter(idx, "value", [
                attributeProperties.min,
                attributeProperties.max,
              ])
            );
            }*/
        }

        /* if(attribute == "frequency"){
          dispatch(setFilter(idx, "type", "range"));
        }*/
        if (attributeProperties) {
          return (
            <div key={attribute}>
              <Typography id="type" gutterBottom>
                {attribute}
              </Typography>
              <Slider
                defaultValue={[
                  attributeProperties.min,
                  attributeProperties.max,
                ]}
                getAriaValueText={valuetext}
                aria-labelledby="range-slider"
                step={1}
                min={attributeProperties.min}
                max={attributeProperties.max}
                valueLabelDisplay="auto"
                disabled={!attributeProperties.max}
                onChangeCommitted={(event: any, newValue: number | number[]) =>
                  handleChange(event, newValue, attribute, idx)
                }
                name={attribute}
              />
            </div>
          );
        } else {
          return <React.Fragment />;
        }
      })}
      {
        (filtersSet = true) //first render done. Filter have beem set}
      }
    </div>
  );
};
export const FilterSliders = connect()(FilterSlidersImpl);
