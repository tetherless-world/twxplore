import './TreeCollapse.scss';
import * as React from "react";
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import {ListGroup, ListGroupItem} from "reactstrap";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TreesQuery_trees from 'twxplore\gui\geo\api\queries\types\TreesQuery'


export interface Feature_List = {
  createdAt: string;
  dbh: number;
  stump: number,
  curbLoc: string,
  status: string,
  health: string | null,
  species: string | null,
  steward: string | null,
  guards: string | null,
  sidewalk: string | null,
  userType: string,
  problems: string[],
  address: string,
  city: string,
  community: number,
  cncldist: number,
  stateAssembly: number,
  stateSenate: number,
  boroughCount: number,
  latitude: number,
  longitude: number,
  x_sp: number,
  y_sp: number,
  bin: number | null,
  bbl: any | null,
  uri: string
}

type TreeCardProps = {
  features: Feature_List,
  callSetMode: Function
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
  }),
);




export const TreeCollapse: React.FunctionComponent<TreeCardProps> = ({features, callSetMode}) => {
    const classes = useStyles();


    const handleClick = (e) => {
      e.preventDefault()
      if (e.target.id == 'species'){
        callSetMode('species')
      }
      else if (e.target.id == 'city'){
        callSetMode('city')
      }
      

    }
    
    return (
        <div>
            <ExpansionPanel>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                 >
                    <Typography className={classes.heading}>Tree id: {features.uri}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <ListGroup className = 'eachFeature'>
                      

                        {Object.keys(features).map(key =>
                          String(features[key]).toLowerCase().indexOf("resource") === -1? <ListGroupItem> {key}: {features[key]} </ListGroupItem> :
                          <ListGroupItem> {key}: <a href="" onClick = {(handleClick)} id = {key}> {features[key]} </a> </ListGroupItem> 
                        )}
                    </ListGroup>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </div>
    );
}

