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
/*
let TypeMap: {id: number; name: string}[] = [];

for(var n in GoalProgressMeasurements) {
  if (typeof GoalProgressMeasurements[n] === 'number') {
      map.push({id: <any>GoalProgressMeasurements[n], name: n});
  }
}
*/

export default function CheckboxesGroup() {
  const classes = useStyles();
  /*
  const [state, setState] = React.useState({
    gilad: true,
    jason: false,
    antoine: false,
  });
  */

  const handleChange = (name: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.target.checked;
    //setState({...state, [name]: event.target.checked});
  };

  //const featureTypes: {[index: string]: String} = {}

  //const error = [gilad, jason, antoine].filter(v => v).length !== 2;
  return (
    <div className={classes.root}>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Choose types to display</FormLabel>
        <FormGroup>
          {Object.keys(FeatureType).map(key => {
            return (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={false}
                    onChange={handleChange((FeatureType as any)[key])}
                    value={(FeatureType as any)[key]}
                  />
                }
                label={(FeatureType as any)[key]}
              />
            );
          })}
        </FormGroup>
        <FormHelperText>Be careful</FormHelperText>
      </FormControl>
    </div>
  );
}
