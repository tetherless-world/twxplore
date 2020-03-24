import * as React from "react";
import {makeStyles, Theme, createStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import {connect, useSelector, useDispatch} from "react-redux";
import {MapState} from "../../states/map/MapState";
import {RootState} from "../../states/root/RootState";
import {setFilter} from "kepler.gl/actions";

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

var filterCount = 0;
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
    attribute: string
  ) => {
    console.log(featureType);
    console.log(newValue);
    console.log(attribute);
    var number;
    if (attribute === "frequency") {
      number = 0;
    } else { //attribute == "timestamp"
      number = 1;
    }
    if (number == 1) //again only giving timeStamp a value
      dispatch(setFilter(number, "value", newValue));
  };

  return (
    <div className={classes.root}>
      <div className={classes.margin} />
      {Object.keys(featureTypeFilter).map(attribute => {
        //attribute being an attribute of a feature e.g. timestamp, frequency
        const attributeProperties = (featureTypeFilter as any)[attribute]; //e.g. timestamp:{min,max}, frequency:{min, max}
        filterCount += 1;
        if (filterCount < 3 && attribute != 'frequency') { //only concerned with timeStamp as frequency breaks things at the moment
          dispatch(setFilter(filterCount - 1, "name", attribute));
        }
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
                  handleChange(event, newValue, attribute)
                }
                name={attribute}
              />
            </div>
          );
        } else {
          return <React.Fragment />;
        }
      })}
    </div>
  );
};
export const FilterSliders = connect()(FilterSlidersImpl);
