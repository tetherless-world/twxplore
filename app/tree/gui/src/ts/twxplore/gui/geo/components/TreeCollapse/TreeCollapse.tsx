import './TreeCollapse.scss';
import * as React from "react";
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import {ListGroup, ListGroupItem} from "reactstrap";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {TreesQuery_trees} from 'twxplore/gui/geo/api/queries/types/TreesQuery'




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




export const TreeCollapse: React.FunctionComponent<{features: TreesQuery_trees, callSetMode: Function}> = ({features, callSetMode}) => {
    const classes = useStyles();
    
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
                      

                        {Object.keys(features).map(key =>{ 
                          const onClick = (e) => { e.preventDefault(); callSetMode(key);}
                          return (String(features[key]).toLowerCase().indexOf("resource") === -1 ? <ListGroupItem> {key}: {features[key]} </ListGroupItem> :
                          <ListGroupItem> {key}: <a href="" onClick = {onClick} id = {key}> {features[key]} </a> </ListGroupItem>)
                          
                      })}
                    </ListGroup>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </div>
    );
}

