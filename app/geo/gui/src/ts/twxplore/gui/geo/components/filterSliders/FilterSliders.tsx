import * as React from "react";
import {makeStyles, Theme, createStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import {connect, useSelector} from "react-redux";
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

const FilterSlidersImpl: React.FunctionComponent<{type: string}> = ({type}) => {
  const classes = useStyles();
  const state: MapState = useSelector(
    (rootState: RootState) => rootState.app.map
  );

  const typeRange = state.typesRanges[type];

  const handleChange = (event: any, newValue: number | number[]) => {
    console.log(type);
    console.log(newValue);
    setFilter(0, type, newValue);
  };

  return (
    <div className={classes.root}>
      <div className={classes.margin} />
      {Object.keys(typeRange).map(attribute => {
        //attribute being an attribute of a feature e.g. timestamp, frequency
        const attributeProperties = (typeRange as any)[attribute]; //e.g. timestamp:{min,max}, frequency:{min, max}
        if (attributeProperties) {
          return (
            <div>
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
                onChange={handleChange}
              />
            </div>
          );
        } else {
          return <div> </div>;
        }
      })}
    </div>
  );
};
export const FilterSliders = connect()(FilterSlidersImpl);
