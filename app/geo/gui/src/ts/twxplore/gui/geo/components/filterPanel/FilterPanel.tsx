import * as React from "react";
import {makeStyles, createStyles} from "@material-ui/core/styles";
import {
  Theme,
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails,
} from "@material-ui/core";
import {useSelector, connect} from "react-redux";
import {MapState} from "../../states/map/MapState";
import {RootState} from "../../states/root/RootState";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {FilterComponent} from "../filterComponent/FilterComponent";
import {FeatureType} from "../../api/graphqlGlobalTypes";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
  })
);

const FilterPanelImpl: React.FunctionComponent = () => {
  const classes = useStyles();
  const state: MapState = useSelector(
    (rootState: RootState) => rootState.app.map
  );

  //const featureTypes: {[index: string]: String} = {}

  //const error = [gilad, jason, antoine].filter(v => v).length !== 2;
  return (
    <div>
      {Object.keys(state.featuresByType).map(featureType => {
        if (featureType != FeatureType.Root) {
          return (
            <ExpansionPanel key={featureType}>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>
                  {featureType}
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <FilterComponent
                  featureType={
                    FeatureType[featureType as keyof typeof FeatureType]
                  }
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
          );
        } else {
          return <React.Fragment />;
        }
      })}
    </div>
  );
};
export const FilterPanel = connect()(FilterPanelImpl);
