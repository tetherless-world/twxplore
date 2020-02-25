import * as React from "react";
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import {ListGroup, ListGroupItem, Collapse, Button, CardBody, Card} from "reactstrap";
//import PropTypes from "prop-types";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {TreesList} from "twxplore/gui/geo/components/trees/TreesList";
import BoroughList from "../BoroughList/BoroughList";
import CityList from "../CityList/CityList";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    arrow: {
        right: '0px',
        marginBottom: '15px',
        cursor: 'pointer',
        '&:hover': {
            color: 'blue'
    }
  },
    arrow_disabled: {
        color: 'grey'
    }
  ),
);



export const PanelParent: React.FunctionComponent<{}> = () => {
    const classes = useStyles();

    const callSetMode = (newMode) => {
        setMode(newMode)
    }
    const [mode, setMode] = React.useState('home')
    React.useEffect(() => {
         console.log(mode)
    });
    return (
        <div>
            <IconButton onClick = {() => setMode('home')} disabled = {mode == 'home'}>
                <ArrowBackIcon className = {(mode == 'home' ? classes.arrow_disabled : classes.arrow)} />
            </IconButton>
            { mode=='home' && <TreesList callSetMode = {callSetMode}/>}
            { mode == 'borough' && <BoroughList/>}
            { mode == 'city' && <CityList/>}
        </div>
    );
}

export default PanelParent



