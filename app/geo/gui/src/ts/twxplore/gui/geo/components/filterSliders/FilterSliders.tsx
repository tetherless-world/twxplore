import * as React from "react";
import {makeStyles, Theme, createStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import {connect, useSelector} from "react-redux";
import {MapState} from "../../states/map/MapState";
import {RootState} from "../../states/root/RootState";

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
                defaultValue={attributeProperties.max}
                getAriaValueText={valuetext}
                aria-labelledby="discrete-slider-small-steps"
                step={1}
                min={attributeProperties.min}
                max={attributeProperties.max}
                valueLabelDisplay="auto"
                disabled={!attributeProperties.max}
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
