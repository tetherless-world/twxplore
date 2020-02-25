import './TreeCollapse.scss';
import * as React from "react";
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';

import {ListGroup, ListGroupItem, Collapse, Button, CardBody, Card} from "reactstrap";
import PropTypes from "prop-types";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';




type Feature_List = {
  createdAt: string,
  dbh: number,
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

    const boroughClick = (e) => {
      e.preventDefault()
      console.log('clicked')
      callSetMode('borough')
    } 

    const cityClick = (e) => {
      e.preventDefault()
      console.log('clicked')
      callSetMode('city')
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
                        <ListGroupItem> dbh: {features.dbh} </ListGroupItem>
                        <ListGroupItem> stump: {features.stump} </ListGroupItem>
                        <ListGroupItem> curbLoc: {features.curbLoc} </ListGroupItem> 
                        <ListGroupItem> status: {features.status} </ListGroupItem> 
                        <ListGroupItem> health: {features.health} </ListGroupItem> 
                        <ListGroupItem> species: {features.species} </ListGroupItem>
                        <ListGroupItem> steward: {features.steward} </ListGroupItem>
                        <ListGroupItem> guards: {features.guards} </ListGroupItem>
                        <ListGroupItem> sidewalk: {features.guards} </ListGroupItem>
                        <ListGroupItem> userType: {features.userType} </ListGroupItem>
                        <ListGroupItem> problems: {features.problems} </ListGroupItem>
                        <ListGroupItem> address: {features.address} </ListGroupItem>
                        <ListGroupItem> city: <a href="" onClick = {(cityClick)}> {features.city} </a> </ListGroupItem>
                        <ListGroupItem> community: {features.community} </ListGroupItem>
                        <ListGroupItem> cncldist: {features.cncldist} </ListGroupItem>
                        <ListGroupItem> stateAssembly: {features.guards} </ListGroupItem>
                        <ListGroupItem> stateSenate: {features.stateSenate} </ListGroupItem>
                        <ListGroupItem> boroughCount: {features.boroughCount} </ListGroupItem>
                        <ListGroupItem> Longitude: {features.longitude} </ListGroupItem>
                        <ListGroupItem> Latitude: {features.latitude} </ListGroupItem>
                        <ListGroupItem> x_sp: {features.x_sp} </ListGroupItem>
                        <ListGroupItem> y_sp: {features.y_sp} </ListGroupItem>
                        <ListGroupItem> bin: {features.bin} </ListGroupItem>
                        <ListGroupItem> bbl: {features.bbl} </ListGroupItem>
                        <ListGroupItem> bbl: <a href="" onClick = {(boroughClick)}> {features.bbl} </a> </ListGroupItem>
                    </ListGroup>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </div>
    );
}



export default TreeCollapse


TreeCollapse.propTypes = {
    features: PropTypes.object.isRequired
  };

