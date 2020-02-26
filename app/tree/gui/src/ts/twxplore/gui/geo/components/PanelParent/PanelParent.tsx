import * as React from "react";
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import {TreesList} from "twxplore/gui/geo/components/trees/TreesList";
import BoroughList from "../BoroughList/BoroughList";
import CityList from "../CityList/CityList";
import SpeciesList from "../SpeciesList/SpeciesList";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    arrow: {
        right: '0px',
        marginBottom: '18px',
        cursor: 'pointer',
        '&:hover': {
            color: 'blue'
    }
  },
    arrow_disabled: {
        color: 'grey'
    }
}))



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
            { mode == 'species' && <SpeciesList/>}
        </div>
    );
}

export default PanelParent



