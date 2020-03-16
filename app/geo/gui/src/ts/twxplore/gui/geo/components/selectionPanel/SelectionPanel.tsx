import * as React from "react";
import {makeStyles, createStyles} from "@material-ui/core/styles";
import {
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  Theme,
} from "@material-ui/core";
import {FeatureType} from "../../api/graphqlGlobalTypes";
import {useSelector, useDispatch, connect} from "react-redux";
import {MapState} from "../../states/map/MapState";
import {RootState} from "../../states/root/RootState";
import {changeTypeVisibility} from "../../actions/map/ChangeTypeVisibilityAction";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    formControl: {
      margin: theme.spacing(3),
    },
  })
);

const SelectionPanelImpl: React.FunctionComponent = () => {
  const classes = useStyles();
  const state: MapState = useSelector(
    (rootState: RootState) => rootState.app.map
  );
  console.log(state.typesVisibility);
  const dispatch = useDispatch();

  const handleChange = (typeEnum: FeatureType) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(changeTypeVisibility(typeEnum));
  };

  //const featureTypes: {[index: string]: String} = {}

  //const error = [gilad, jason, antoine].filter(v => v).length !== 2;
  return (
    <div className={classes.root}>
      <FormControl className={classes.formControl}>
        <FormLabel component="legend">Choose types to display</FormLabel>
        <FormGroup>
          {Object.values(FeatureType).map(typeString => {
            //const typeName = (FeatureType as any)[key];
            const typeEnum: FeatureType =
              FeatureType[typeString as keyof typeof FeatureType];
            return (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.typesVisibility[typeEnum]}
                    onChange={handleChange(typeEnum)}
                    value={typeString}
                  />
                }
                label={typeString}
              />
            );
          })}
        </FormGroup>
        <FormHelperText>
          Types chosen here will be visible on the map and invisible otherwise.
        </FormHelperText>
      </FormControl>
    </div>
  );
};
export const SelectionPanel = connect()(SelectionPanelImpl);